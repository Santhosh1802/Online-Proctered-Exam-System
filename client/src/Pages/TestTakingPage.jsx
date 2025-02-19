import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import axios from "axios";

export default function TestTakingPage() {
  const { testId } = useParams(); // Get testId from URL
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  // Fetch test details
  useEffect(() => {
    axios
      .get(`/api/test/${testId}`)
      .then((res) => setTest(res.data))
      .catch((err) => console.error("Error fetching test:", err));
  }, [testId]);

  // Handle Answer Selection
  const handleAnswerChange = (questionId, value, isMultiple = false) => {
    setAnswers((prevAnswers) => {
      if (isMultiple) {
        // For multiple-choice: Toggle selection
        const updatedAnswers = prevAnswers[questionId] || [];
        const index = updatedAnswers.indexOf(value);
        if (index === -1) updatedAnswers.push(value);
        else updatedAnswers.splice(index, 1);
        return { ...prevAnswers, [questionId]: updatedAnswers };
      }
      return { ...prevAnswers, [questionId]: value };
    });
  };

  // Navigation
  const nextQuestion = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit Test
  const handleSubmit = () => {
    axios
      .post("/api/student/submit-test", { testId, answers })
      .then((res) => alert("Test submitted successfully!"))
      .catch((err) => console.error("Error submitting test:", err));
  };

  if (!test) return <p>Loading test...</p>;

  const question = test.questions[currentQuestionIndex];

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>{test.testname}</h2>
      <Card title={`Question ${currentQuestionIndex + 1}`}>
        <p>{question.questionText}</p>

        {/* Show Image if available */}
        {question.image && (
          <img src={question.image} alt="question" style={{ width: "100%", marginBottom: "1rem" }} />
        )}

        {/* Render Different Question Types */}
        {question.type === "choose-one" && (
          question.options.map((option, index) => (
            <div key={index} className="p-field-radiobutton">
              <RadioButton
                inputId={option}
                name="answer"
                value={option}
                onChange={() => handleAnswerChange(question._id, option)}
                checked={answers[question._id] === option}
              />
              <label htmlFor={option}>{option}</label>
            </div>
          ))
        )}

        {question.type === "choose-multiple" && (
          question.options.map((option, index) => (
            <div key={index} className="p-field-checkbox">
              <Checkbox
                inputId={option}
                name="answer"
                value={option}
                onChange={() => handleAnswerChange(question._id, option, true)}
                checked={answers[question._id]?.includes(option)}
              />
              <label htmlFor={option}>{option}</label>
            </div>
          ))
        )}

        {question.type === "true-false" && (
          <>
            <div className="p-field-radiobutton">
              <RadioButton
                inputId="true"
                name="answer"
                value="true"
                onChange={() => handleAnswerChange(question._id, "true")}
                checked={answers[question._id] === "true"}
              />
              <label htmlFor="true">True</label>
            </div>
            <div className="p-field-radiobutton">
              <RadioButton
                inputId="false"
                name="answer"
                value="false"
                onChange={() => handleAnswerChange(question._id, "false")}
                checked={answers[question._id] === "false"}
              />
              <label htmlFor="false">False</label>
            </div>
          </>
        )}

        {question.type === "fill-in-the-blanks" && (
          <InputText
            value={answers[question._id] || ""}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            placeholder="Type your answer..."
          />
        )}
      </Card>

      {/* Navigation & Submission */}
      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
        <Button label="Previous" onClick={prevQuestion} disabled={currentQuestionIndex === 0} />
        {currentQuestionIndex === test.questions.length - 1 ? (
          <Button label="Submit Test" onClick={handleSubmit} className="p-button-success" />
        ) : (
          <Button label="Next" onClick={nextQuestion} />
        )}
      </div>
    </div>
  );
}
