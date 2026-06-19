import React, { useState, useEffect } from "react";
import { Input, Textarea, Button } from "../components/common";
import { Modal } from "../components/Modal";
import { trimFormData, validateVocabularyForm } from "../utils/helpers";
import { useVocabularyStore } from "../context/vocabularyStore";
import vocabularyApi from "../services/api";
import toast from "react-hot-toast";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../constants/app";

/**
 * Add/Edit Word Modal
 */
export const AddWordModal = ({
  isOpen,
  onClose,
  editingWord = null,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    word: "",
    definition: "",
    example: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const store = useVocabularyStore();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (editingWord) {
        setFormData({
          word: editingWord.word,
          definition: editingWord.definition,
          example: editingWord.example,
        });
      } else {
        setFormData({ word: "", definition: "", example: "" });
      }
      setErrors({});
    } else {
      // Delay clearing form data to avoid modal flicker during exit animation
      const timer = setTimeout(() => {
        setFormData({ word: "", definition: "", example: "" });
        setErrors({});
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, editingWord]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const trimmed = trimFormData(formData);
    const validation = validateVocabularyForm(trimmed);

    if (!validation.isValid) {
      const errorMap = {};
      validation.errors.forEach((error) => {
        if (error.includes("Word")) errorMap.word = error;
        if (error.includes("Definition")) errorMap.definition = error;
        if (error.includes("Example")) errorMap.example = error;
      });
      setErrors(errorMap);
      return;
    }

    setIsLoading(true);
    try {
      if (editingWord) {
        // Update
        const response = await vocabularyApi.update({
          id: editingWord.id,
          word: trimmed.word,
          definition: trimmed.definition,
          example: trimmed.example,
        });

        if (response.succeeded) {
          store.updateVocabulary(editingWord.id, trimmed);
          toast.success(SUCCESS_MESSAGES.WORD_UPDATED);
          onClose();
          onSuccess?.();
        } else {
          toast.error(response.message || ERROR_MESSAGES.SERVER_ERROR);
        }
      } else {
        // Create
        const response = await vocabularyApi.create({
          word: trimmed.word,
          definition: trimmed.definition,
          example: trimmed.example,
        });

        if (response.succeeded) {
          store.addVocabulary(response.data);
          toast.success(SUCCESS_MESSAGES.WORD_ADDED);
          onClose();
          onSuccess?.();
        } else {
          toast.error(response.message || ERROR_MESSAGES.SERVER_ERROR);
        }
      }
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingWord ? "Edit Word" : "Add New Word"}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {editingWord ? "Update" : "Add"} Word
          </Button>
        </>
      }
    >
      <form className="space-y-5">
        <Input
          label="Word"
          name="word"
          value={formData.word}
          onChange={handleChange}
          placeholder="Enter the English word"
          error={errors.word}
          maxLength={100}
        />

        <Textarea
          label="Definition"
          name="definition"
          value={formData.definition}
          onChange={handleChange}
          placeholder="Enter the definition"
          error={errors.definition}
          maxLength={500}
        />

        <Textarea
          label="Example Sentence"
          name="example"
          value={formData.example}
          onChange={handleChange}
          placeholder="Enter an example sentence"
          error={errors.example}
          maxLength={500}
        />
      </form>
    </Modal>
  );
};
