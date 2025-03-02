/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import FaceDetection from "../Components/FaceDetection";
import NoiseDetection from "../Components/NoiseDetection";
import TabSwitchDetector from "../Components/TabSwitcherDetector";
import {
  IncrementTestCurrentTime,
  saveAnswer,
  setAnswers,
} from "../Store/testSlice";
export default function TestTakingPage({ toast }) {
  let { testId } = useParams();
  const dispatch = useDispatch();
  const testSlice = useSelector((state) => state.test);
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswersState] = useState({});
  const [timeLeft, setTimeLeft] = useState(10);
  const [submitted, setSubmitted] = useState(false); // New state to track submission
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_STUDENT_GET_ONE_TEST}?id=${testId}`)
      .then((res) => {
        const testData = res.data.data;
        setTest(testData);
        setTimeLeft(testSlice.test_duration - testSlice.test_current_time);
        // Initialize answers only if it's empty
        if (Object.keys(testSlice.answers).length === 0) {
          dispatch(setAnswers(testData.answers || {}));
          setAnswersState(testData.answers || {});
          console.log("if", testSlice.answers);
        } else {
          setAnswersState(testSlice.answers);
          console.log(testSlice.answers);
        }
      })
      .catch((err) => console.error("Error fetching test:", err));
  }, [testId]);
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(IncrementTestCurrentTime());
    }, 5000);
    return () => clearInterval(interval);
  }, [dispatch]);
  const handleAnswerChange = (questionId, value, isMultiple = false) => {
    setAnswersState((prevAnswers) => {
      let updatedAnswers = { ...prevAnswers };

      if (isMultiple) {
        // Ensure it's an array
        let prevSelected = updatedAnswers[questionId] || [];

        if (prevSelected.includes(value)) {
          updatedAnswers[questionId] = prevSelected.filter(
            (opt) => opt !== value
          );
        } else {
          updatedAnswers[questionId] = [...prevSelected, value]; // Append new value
        }
      } else {
        updatedAnswers[questionId] = [value]; // Store as an array for consistency
      }

      // Dispatch the updated answers to Redux
      dispatch(
        saveAnswer({
          questionId,
          answer: updatedAnswers[questionId],
          isMultiple,
        })
      );
      console.log("Answers", updatedAnswers);

      return updatedAnswers;
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
    setSubmitted(true); // Set submitted to true to prevent multiple submissions
    console.log(answers);

    axios
      .post(process.env.REACT_APP_STUDENT_SUBMIT_TEST, { testId, answers })
      .then((res) => alert("Test submitted successfully!"))
      .catch((err) => console.error("Error submitting test:", err));
  };

  if (!test) return <p>Loading test...</p>;

  const question = test.questions[currentQuestionIndex];

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* {window.addEventListener("contextmenu", handleContextMenu)} */}
      <div
        style={{
          //width: "300px",
          overflowY: "auto",
          borderRight: "1px solid #ddd",
          padding: "1rem",
        }}
      >
        <div style={{ width: "100%", height: "300px" }}>
          <h3 style={{ marginLeft: "5px" }}>
            {test.proctor_settings.length > 0
              ? "Proctoring Enabled Test"
              : "No Proctoring for this test"}
          </h3>
          {test.proctor_settings.includes("Face Detection") && (
            <FaceDetection toast={toast} />
          )}
          {test.proctor_settings.includes("Noise Detection") && (
            <NoiseDetection toast={toast} />
          )}
          {test.proctor_settings.includes("Tab Switching") && ( 

          <TabSwitchDetector toast={toast}/>)}
          <div>
          {test.proctor_settings.lenght===0 ? test.testname:""}
          </div>
        </div>
        <h3>Questions</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
            //border:"2px solid black",
            width: "300px",
          }}
        >
          {test.questions.map((q, index) => (
            <Button
              key={q._id}
              label={`${index + 1}`}
              onClick={() => setCurrentQuestionIndex(index)}
              className={
                answers[q._id] ? "p-button-success" : "p-button-secondary"
              }
              style={{ width: "50px", height: "50px" }}
            />
          ))}
        </div>
      </div>
      <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        <h1>{test.testname}</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              padding: "1em",
              borderRadius: "1em",
            }}
          >
            Time Left: {formatTime(timeLeft)}
          </h3>
        </div>
        <Card title={`Question ${currentQuestionIndex + 1}`}>
          <p>{question.questionText}</p>
          {question.image && (
            <img
              src={question.image}
              alt="question"
              style={{ width: "100%", marginBottom: "1rem" }}
            />
          )}
          <div style={{ marginBottom: "1rem" }}>
            {question.type === "choose-one" &&
              question.options.map((option, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <RadioButton
                    inputId={option}
                    name={question._id}
                    value={option}
                    onChange={(e) => handleAnswerChange(question._id, e.value)}
                    checked={
                      answers[question._id] &&
                      answers[question._id][0].toString() === option
                    }
                  />
                  <label
                    htmlFor={question._id}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    {option}
                  </label>
                </div>
              ))}
            {question.type === "choose-multiple" &&
              question.options.map((option, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Checkbox
                    inputId={option}
                    name={question._id}
                    value={option}
                    onChange={(e) =>
                      handleAnswerChange(question._id, e.value, true)
                    }
                    checked={
                      Array.isArray(answers[question._id]) &&
                      (answers[question._id].includes(option) ||
                        (answers[question._id].length > 0 &&
                          answers[question._id][
                            answers[question._id].length - 1
                          ].includes(option)))
                    }
                  />
                  <label htmlFor={option} style={{ marginLeft: "0.5rem" }}>
                    {option}
                  </label>
                </div>
              ))}
            {question.type === "true-false" && (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <RadioButton
                    inputId="true"
                    name="answer"
                    value="true"
                    onChange={() => handleAnswerChange(question._id, "true")}
                    checked={
                      answers[question._id] &&
                      answers[question._id][0].toString() === "true"
                    }
                  />
                  <label htmlFor="true" style={{ marginLeft: "0.5rem" }}>
                    True
                  </label>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <RadioButton
                    inputId="false"
                    name="answer"
                    value="false"
                    onChange={() => handleAnswerChange(question._id, "false")}
                    checked={
                      answers[question._id] &&
                      answers[question._id][0].toString() === "false"
                    }
                  />
                  <label htmlFor="false" style={{ marginLeft: "0.5rem" }}>
                    False
                  </label>
                </div>
              </>
            )}
            {question.type === "fill-in-the-blanks" && (
              <InputText
                value={answers[question._id] ? answers[question._id][0] : ""}
                onChange={(e) =>
                  handleAnswerChange(question._id, e.target.value)
                }
                placeholder="Type your answer..."
                style={{ width: "100%", marginTop: "0.5rem" }}
              />
            )}
          </div>
        </Card>
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            label="Previous"
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
          />
          {currentQuestionIndex === test.questions.length - 1 ? (
            <Button
              label="Submit Test"
              onClick={handleSubmit}
              className="p-button-success"
            />
          ) : (
            <Button label="Next" onClick={nextQuestion} />
          )}
        </div>
      </div>
    </div>
  );
}
