/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState ,Suspense} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import axios from "axios";

import NoiseDetection from "../Components/NoiseDetection";
import TabSwitchDetector from "../Components/TabSwitcherDetector";

//import PermissionDialog from "../Components/PermissionDialog";
import {
  IncrementTestCurrentTime,
  resetTest,
  saveAnswer,
  selectProctoring,
  setAnswers,
  setPermissions,
} from "../Store/testSlice";
const FaceDetection = React.lazy(()=>import("../Components/FaceDetection"));

export default function TestTakingPage({ toast }) {
  let { testId } = useParams();
  const dispatch = useDispatch();
  const testSlice = useSelector((state) => state.test);
  const userSlice = useSelector((state) => state.user);
  const proctoring = useSelector(selectProctoring);
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswersState] = useState({});
  const [timeLeft, setTimeLeft] = useState(10);
  const [submitted, setSubmitted] = useState(false);
  //const [permissionDialogVisible, setPermissionDialogVisible] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_STUDENT_GET_ONE_TEST}?id=${testId}`,{withCredentials:true})
      .then((res) => {
        const testData = res.data.data;
        setTest(testData);
        setTimeLeft(testSlice.test_duration - testSlice.test_current_time);
        if (Object.keys(testSlice.answers).length === 0) {
          const initialAnswers = testData.answers || {};
          dispatch(setAnswers(initialAnswers));
          setAnswersState(initialAnswers);
          console.log("if", initialAnswers);
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
        const currentAnswers = updatedAnswers[questionId]
          ? updatedAnswers[questionId].split(",")
          : [];
        const index = currentAnswers.indexOf(value);

        if (index !== -1) {
          currentAnswers.splice(index, 1);
        } else {
          currentAnswers.push(value);
        }

        updatedAnswers[questionId] = currentAnswers.join(",");
      } else {
        updatedAnswers[questionId] = value;
      }

      return updatedAnswers;
    });
  };

  const clearAnswer = (questionId) => {
    setAnswersState((prevAnswers) => {
      let updatedAnswers = { ...prevAnswers };
      updatedAnswers[questionId] = "";
      return updatedAnswers;
    });
  };

  const saveCurrentAnswer = () => {
    const questionId = test.questions[currentQuestionIndex]._id;
    const answer = answers[questionId];
    const isMultiple =
      test.questions[currentQuestionIndex].type === "choose-multiple";

    dispatch(
      saveAnswer({
        questionId,
        answer,
        isMultiple,
      })
    );
  };

  const nextQuestion = () => {
    saveCurrentAnswer();
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    saveCurrentAnswer();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const requestPermissions = async () => {
    const permissions = {
      faceDetection: false,
      noiseDetection: false,
      tabSwitching: false,
    };

    if (test.proctor_settings.includes("Face Detection")) {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        permissions.faceDetection = true;
      } catch (error) {
        permissions.faceDetection = false;
      }
    }

    if (test.proctor_settings.includes("Noise Detection")) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        permissions.noiseDetection = true;
      } catch (error) {
        permissions.noiseDetection = false;
      }
    }

    if (test.proctor_settings.includes("Tab Switching")) {
      permissions.tabSwitching = true;
    }

    dispatch(setPermissions(permissions));
  };

  // useEffect(() => {
  //   if (test) {
  //     setPermissionDialogVisible(true);
  //   }
  // }, [test]);

  // const handleGrantPermissions = async () => {
  //   await requestPermissions();
  //   setPermissionDialogVisible(false);
  // };

  // const handleHideDialog = () => {
  //   setPermissionDialogVisible(false);
  // };

  const handleSubmit = () => {
    saveCurrentAnswer();
    setSubmitted(true);
    console.log(answers);
    console.log(proctoring);

    axios
      .post(process.env.REACT_APP_STUDENT_SUBMIT_TEST, {
        testId,
        answers,
        test_duration: testSlice.test_current_time,
        proctor_scores: proctoring,
        student_id: userSlice.id,
      },{withCredentials:true})
      .then((res) => {
        dispatch(resetTest());
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Test Submitted Successfully!",
        });
        navigate("/studentdashboard");
        window.location.reload();
      })
      .catch((err) => console.error("Error submitting test:", err));
  };

  if (!test) return <p>Loading test...</p>;

  const question = test.questions[currentQuestionIndex];

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // const handleContextMenu = (e) => {
  //   e.preventDefault();
  // };

  return (
    <div
      style={{ display: "flex", height: "100vh" }}
    >
      {/* <PermissionDialog
        visible={permissionDialogVisible}
        onHide={handleHideDialog}
        onGrant={handleGrantPermissions}
      /> */}
      <div
        style={{
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
          <Suspense fallback={<div>Loading...</div>}>
          {test.proctor_settings.includes("Face Detection") && (
            <FaceDetection toast={toast} />
          )}
          </Suspense>
          {test.proctor_settings.includes("Noise Detection") && (
            <NoiseDetection toast={toast} />
          )}
          {test.proctor_settings.includes("Tab Switching") && (
            <TabSwitchDetector toast={toast} />
          )}
          <div>{test.proctor_settings.length === 0 ? test.testname : ""}</div>
        </div>
        <h3>Questions</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ flex: 1, marginRight: "2rem" }}>
              <p>{question.questionText}</p>
              {question.image && (
                <img
                  src={question.image}
                  alt="question"
                  style={{ width: "100%", marginBottom: "1rem" }}
                />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h4>{question.type.replace("-", " ").toUpperCase()}</h4>
              <div style={{ marginBottom: "1rem" }}>
                {question.type === "choose-one" &&
                  question.options.map((option, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                        padding: "1em",
                        border: "1px solid grey",
                        backgroundColor:
                          answers[question._id] &&
                          answers[question._id].toString() === option
                            ? "grey"
                            : "",
                        color:
                          answers[question._id] &&
                          answers[question._id].toString() === option
                            ? "black"
                            : "",
                      }}
                    >
                      <RadioButton
                        inputId={option}
                        name={question._id}
                        value={option}
                        onChange={(e) =>
                          handleAnswerChange(question._id, e.value)
                        }
                        checked={
                          answers[question._id] &&
                          answers[question._id].toString() === option
                        }
                      />
                      <label
                        htmlFor={option}
                        style={{ width: "100%", marginLeft: "1rem" }}
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
                        padding: "1em",
                        border: "1px solid grey",
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
                          answers[question._id] &&
                          answers[question._id].split(",").includes(option)
                        }
                      />
                      <label
                        htmlFor={option}
                        style={{ width: "100%", marginLeft: "1rem" }}
                      >
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
                        padding: "1em",
                        border: "1px solid grey",
                        backgroundColor:
                          answers[question._id] &&
                          answers[question._id].toString() === "true"
                            ? "grey"
                            : "",
                        color:
                          answers[question._id] &&
                          answers[question._id].toString() === "true"
                            ? "black"
                            : "",
                      }}
                    >
                      <RadioButton
                        inputId="true"
                        name="answer"
                        value="true"
                        onChange={() =>
                          handleAnswerChange(question._id, "true")
                        }
                        checked={
                          answers[question._id] &&
                          answers[question._id].toString() === "true"
                        }
                      />
                      <label
                        htmlFor="true"
                        style={{ width: "100%", marginLeft: "1rem" }}
                      >
                        True
                      </label>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                        padding: "1em",
                        border: "1px solid grey",
                        backgroundColor:
                          answers[question._id] &&
                          answers[question._id].toString() === "false"
                            ? "grey"
                            : "",
                        color:
                          answers[question._id] &&
                          answers[question._id].toString() === "false"
                            ? "black"
                            : "",
                      }}
                    >
                      <RadioButton
                        inputId="false"
                        name="answer"
                        value="false"
                        onChange={() =>
                          handleAnswerChange(question._id, "false")
                        }
                        checked={
                          answers[question._id] &&
                          answers[question._id].toString() === "false"
                        }
                      />
                      <label
                        htmlFor="false"
                        style={{ width: "100%", marginLeft: "1rem" }}
                      >
                        False
                      </label>
                    </div>
                  </>
                )}
                {question.type === "fill-in-the-blanks" && (
                  <InputText
                    value={answers[question._id] ? answers[question._id] : ""}
                    onChange={(e) =>
                      handleAnswerChange(question._id, e.target.value)
                    }
                    placeholder="Type your answer..."
                    style={{ width: "100%", marginTop: "1rem" }}
                  />
                )}
              </div>
              <Button
                label="Clear Selection"
                onClick={() => clearAnswer(question._id)}
                style={{ border: "none", color: "grey", background: "none" }}
              />
            </div>
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
