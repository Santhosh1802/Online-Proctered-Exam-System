import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import axios from "axios";

export default function TestTakingPage() {
  let { testId } = useParams();
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  testId="67b34ed10205063ce21aac54";
  useEffect(() => {
    axios
      .get(`http://localhost:5000/getOnetest-teacher?id=${testId}`)
      .then((res) => setTest(res.data.data))
      .catch((err) => console.error("Error fetching test:", err));
  }, [testId]);

  const handleAnswerChange = (questionId, value, isMultiple = false) => {
    setAnswers((prevAnswers) => {
      if (isMultiple) {
        const updatedAnswers = prevAnswers[questionId] || [];
        const index = updatedAnswers.indexOf(value);
        if (index === -1) updatedAnswers.push(value);
        else updatedAnswers.splice(index, 1);
        return { ...prevAnswers, [questionId]: updatedAnswers };
      }
      return { ...prevAnswers, [questionId]: value };
    });
  };

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

  const handleSubmit = () => {
    axios
      .post("/api/student/submit-test", { testId, answers })
      .then((res) => alert("Test submitted successfully!"))
      .catch((err) => console.error("Error submitting test:", err));
  };

  if (!test) return <p>Loading test...</p>;

  const question = test.questions[currentQuestionIndex];

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "20%", overflowY: "auto", borderRight: "1px solid #ddd", padding: "1rem" }}>
        <h3>Questions</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
          {test.questions.map((q, index) => (
            <Button
              key={q._id}
              label={`${index + 1}`}
              onClick={() => setCurrentQuestionIndex(index)}
              className={answers[q._id] ? "p-button-success" : "p-button-secondary"}
              style={{ width: "50px", height: "50px" }}
            />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        <h2>{test.testname}</h2>
        <Card title={`Question ${currentQuestionIndex + 1}`}>
          <p>{question.questionText}</p>

          {question.image && (
            <img src={question.image} alt="question" style={{ width: "100%", marginBottom: "1rem" }} />
          )}

          <div style={{ marginBottom: "1rem" }}>
            {question.type === "choose-one" &&
              question.options.map((option, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                  <RadioButton
                    inputId={option}
                    name="answer"
                    value={option}
                    onChange={() => handleAnswerChange(question._id, option)}
                    checked={answers[question._id] === option}
                  />
                  <label htmlFor={option} style={{ marginLeft: "0.5rem" }}>{option}</label>
                </div>
              ))}

            {question.type === "choose-multiple" &&
              question.options.map((option, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                  <Checkbox
                    inputId={option}
                    name="answer"
                    value={option}
                    onChange={() => handleAnswerChange(question._id, option, true)}
                    checked={answers[question._id]?.includes(option)}
                  />
                  <label htmlFor={option} style={{ marginLeft: "0.5rem" }}>{option}</label>
                </div>
              ))}

            {question.type === "true-false" && (
              <>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                  <RadioButton
                    inputId="true"
                    name="answer"
                    value="true"
                    onChange={() => handleAnswerChange(question._id, "true")}
                    checked={answers[question._id] === "true"}
                  />
                  <label htmlFor="true" style={{ marginLeft: "0.5rem" }}>True</label>
                </div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                  <RadioButton
                    inputId="false"
                    name="answer"
                    value="false"
                    onChange={() => handleAnswerChange(question._id, "false")}
                    checked={answers[question._id] === "false"}
                  />
                  <label htmlFor="false" style={{ marginLeft: "0.5rem" }}>False</label>
                </div>
              </>
            )}

            {question.type === "fill-in-the-blanks" && (
              <InputText
                value={answers[question._id] || ""}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                placeholder="Type your answer..."
                style={{ width: "100%", marginTop: "0.5rem" }}
              />
            )}
          </div>
        </Card>

        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
          <Button label="Previous" onClick={prevQuestion} disabled={currentQuestionIndex === 0} />
          {currentQuestionIndex === test.questions.length - 1 ? (
            <Button label="Submit Test" onClick={handleSubmit} className="p-button-success" />
          ) : (
            <Button label="Next" onClick={nextQuestion} />
          )}
        </div>
      </div>
    </div>
  );
}
