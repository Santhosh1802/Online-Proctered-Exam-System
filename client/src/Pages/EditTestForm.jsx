import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import axios from "axios";
import { useSelector } from "react-redux";
import { MultiSelect } from "primereact/multiselect";
import { useNavigate, useParams } from "react-router-dom";
const EditTestForm = ({ toast }) => {
  const [testData, setTestData] = useState({
    test_id: "",
    testname: "",
    description: "",
    start_date: "",
    end_date: "",
    duration: 0,
    proctor_settings: [],
    questions: [],
  });
  const { testId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (testId) {
      axios
        .get(`${process.env.REACT_APP_TEACHER_GET_ONE_TEST}`, {
          params: { id: testId },
          withCredentials: true,
        })
        .then((response) => {
          const test = response.data.data;
          setTestData({
            ...test,
            start_date: new Date(test.start_date),
            end_date: new Date(test.end_date),
            test_id: testId,
          });
        })
        .catch((error) => console.error("Error fetching test data:", error));
    }
  }, [testId]);
  const questionTypes = [
    { label: "Fill in the Blanks", value: "fill-in-the-blanks" },
    { label: "Choose One", value: "choose-one" },
    { label: "Choose Multiple", value: "choose-multiple" },
    { label: "True/False", value: "true-false" },
  ];
  const proctorOptions = ["Face Detection", "Tab Switching", "Noise Detection"];
  const addQuestion = () => {
    setTestData({
      ...testData,
      questions: [
        ...testData.questions,
        {
          questionText: "",
          type: "",
          options: [],
          correctAnswers: [],
          marks: 1,
          negativeMarks: 0,
          image: null,
        },
      ],
    });
  };
  const removeQuestion = (index) => {
    const updatedQuestions = testData.questions.filter((_, i) => i !== index);
    setTestData({ ...testData, questions: updatedQuestions });
  };
  const updateQuestion = (index, key, value) => {
    const updatedQuestions = [...testData.questions];
    updatedQuestions[index][key] = value;
    setTestData({ ...testData, questions: updatedQuestions });
  };
  const addOption = (index) => {
    const updatedQuestions = [...testData.questions];
    updatedQuestions[index].options.push("");
    setTestData({ ...testData, questions: updatedQuestions });
  };

  const removeOption = (qIndex, oIndex) => {
    const updatedQuestions = [...testData.questions];
    updatedQuestions[qIndex].options.splice(oIndex, 1);
    setTestData({ ...testData, questions: updatedQuestions });
  };
  const updateOption = (qIndex, oIndex, value) => {
    const updatedQuestions = [...testData.questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setTestData({ ...testData, questions: updatedQuestions });
  };
  const handleImageUpload = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateQuestion(index, "image", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const removeImage = (index) => {
    updateQuestion(index, "image", "");
  };
  const email = useSelector((store) => store.user.email);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = { ...testData, email };

    try {
      let response;
      console.log(testData);

      if (testData.test_id) {
        // Update existing test
        response = await axios.put(
          `${process.env.REACT_APP_TEACHER_UPDATE_ONE_TEST}`,
          requestData,
          { params: { id: testData.test_id }, withCredentials: true }
        );
      }

      if (response.status === 200 || response.status === 201) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Test Updated Successfully",
        });

        setTestData({
          test_id: "",
          testname: "",
          description: "",
          start_date: "",
          end_date: "",
          duration: "",
          proctor_settings: [],
          questions: [],
        });
        navigate("/teachertest");
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to save test",
        });
      }
    } catch (error) {
      console.error("Error saving test:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to save test",
      });
    }
  };
  const toggleProctorSetting = (option) => {
    let updatedSettings = [...testData.proctor_settings];
    if (updatedSettings.includes(option)) {
      updatedSettings = updatedSettings.filter((setting) => setting !== option);
    } else {
      updatedSettings.push(option);
    }
    setTestData({ ...testData, proctor_settings: updatedSettings });
  };
  const navigateBack = () => {
    window.history.back();
  };
  return (
    <div>
      <Button onClick={navigateBack} style={{margin:"1em",position:"fixed"}}>Back</Button>
      <div className="p-4" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2 className="text-center mb-4">Editing {testData.testname}</h2>
        <form onSubmit={handleSubmit} className="p-fluid grid gap-3">
          <div className="col-12">
            <label>Test Name</label>
            <InputText
              className="w-full"
              value={testData.testname}
              onChange={(e) =>
                setTestData({ ...testData, testname: e.target.value })
              }
              required
            />
          </div>
          <div className="col-12">
            <label>Description</label>
            <InputTextarea
              className="w-full"
              value={testData.description}
              onChange={(e) =>
                setTestData({ ...testData, description: e.target.value })
              }
              required
            />
          </div>
          <div className="col-12">
            <label>Start Date</label>
            <Calendar
              className="w-full"
              value={testData.start_date}
              onChange={(e) =>
                setTestData({ ...testData, start_date: e.value })
              }
              showTime
              required
            />
          </div>
          <div className="col-12">
            <label>End Date</label>
            <Calendar
              className="w-full"
              value={testData.end_date}
              onChange={(e) => setTestData({ ...testData, end_date: e.value })}
              showTime
              required
            />
          </div>
          <div className="col-12">
            <label>Duration (Minutes)</label>
            <InputText
              className="w-full"
              keyfilter={"num"}
              value={testData.duration}
              onChange={(e) =>
                setTestData({ ...testData, duration: e.target.value })
              }
              required
            />
          </div>
          <h3 className="col-12 mt-4">Proctor Settings</h3>
          <div className="col-12 flex flex-wrap gap-2">
            {proctorOptions.map((option) => (
              <div key={option} className="flex align-items-center">
                <Checkbox
                  inputId={option}
                  checked={testData.proctor_settings.includes(option)}
                  onChange={() => toggleProctorSetting(option)}
                />
                <label htmlFor={option} className="ml-2">
                  {option}
                </label>
              </div>
            ))}
          </div>
          <h3 className="col-12 mt-4">Questions</h3>
          {testData.questions.map((question, qIndex) => (
            <div
              key={qIndex}
              className="col-12 p-3 border-1 border-round surface-border"
            >
              <h3>Question {qIndex + 1}</h3>
              <InputText
                className="w-full"
                placeholder="Enter question"
                value={question.questionText}
                onChange={(e) =>
                  updateQuestion(qIndex, "questionText", e.target.value)
                }
                required
              />
              <label className="mt-2">Type</label>
              <Dropdown
                className="w-full mt-2"
                value={question.type}
                options={questionTypes}
                onChange={(e) => updateQuestion(qIndex, "type", e.value)}
                placeholder="Select Type"
                required
              />
              <label className="mt-2">Marks</label>
              <InputText
                className="w-full mt-2"
                type="number"
                placeholder="Marks"
                value={question.marks}
                onChange={(e) =>
                  updateQuestion(qIndex, "marks", e.target.value)
                }
              />
              <label className="mt-2">Negative Marks</label>
              <InputText
                className="w-full mt-2"
                type="number"
                placeholder="Negative Marks"
                value={question.negativeMarks}
                onChange={(e) =>
                  updateQuestion(qIndex, "negativeMarks", e.target.value)
                }
              />
              {["choose-one", "choose-multiple"].includes(question.type) && (
                <div className="mt-3">
                  <h4>Options</h4>
                  {question.options.map((option, oIndex) => (
                    <div
                      key={oIndex}
                      className="flex align-items-center gap-2 mt-2"
                    >
                      <InputText
                        className="w-full"
                        value={option}
                        onChange={(e) =>
                          updateOption(qIndex, oIndex, e.target.value)
                        }
                      />
                      <Button
                        icon="pi pi-times"
                        className="p-button-danger p-button-sm"
                        onClick={() => removeOption(qIndex, oIndex)}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    label="Add Option"
                    icon="pi pi-plus"
                    className="p-button-secondary mt-2"
                    onClick={() => addOption(qIndex)}
                  />
                </div>
              )}
              {question.type === "choose-one" &&
                question.options.length > 0 && (
                  <div className="mt-3">
                    <h4>Select Correct Answer</h4>
                    <Dropdown
                      className="w-full"
                      value={question.correctAnswers[0] || ""}
                      options={question.options.map((opt) => ({
                        label: opt,
                        value: opt,
                      }))}
                      onChange={(e) =>
                        updateQuestion(qIndex, "correctAnswers", [e.value])
                      }
                      placeholder="Choose Correct Answer"
                    />
                  </div>
                )}
              {question.type === "choose-multiple" &&
                question.options.length > 0 && (
                  <div className="mt-3">
                    <h4>Select Correct Answers</h4>
                    <MultiSelect
                      className="w-full"
                      value={question.correctAnswers}
                      options={question.options.map((opt) => ({
                        label: opt,
                        value: opt,
                      }))}
                      onChange={(e) =>
                        updateQuestion(qIndex, "correctAnswers", e.value)
                      }
                      placeholder="Select Correct Answers"
                      display="chip"
                    />
                  </div>
                )}
              {question.type === "fill-in-the-blanks" && (
                <div className="mt-3">
                  <h4>Correct Answer</h4>
                  <InputText
                    className="w-full"
                    value={question.correctAnswers[0] || ""}
                    onChange={(e) =>
                      updateQuestion(qIndex, "correctAnswers", [e.target.value])
                    }
                    placeholder="Enter the correct answer"
                  />
                </div>
              )}
              {question.type === "true-false" && (
                <div className="mt-3">
                  <h4>Select Correct Answer</h4>
                  <Dropdown
                    className="w-full"
                    value={question.correctAnswers[0] || ""}
                    options={[
                      { label: "True", value: "true" },
                      { label: "False", value: "false" },
                    ]}
                    onChange={(e) =>
                      updateQuestion(qIndex, "correctAnswers", [e.value])
                    }
                    placeholder="Choose Correct Answer"
                  />
                </div>
              )}
              <div className="mt-3">
                <label>Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, qIndex)}
                />
                {question.image && (
                  <div className="mt-2">
                    <img
                      src={question.image}
                      alt="Uploaded"
                      className="mt-2"
                      style={{ maxWidth: "100px" }}
                    />
                    <button
                      type="button"
                      className="p-button-danger p-button-sm mt-2"
                      onClick={() => removeImage(qIndex)}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
              <Button
                type="button"
                label="Remove Question"
                icon="pi pi-trash"
                className="p-button-danger mt-3"
                onClick={() => removeQuestion(qIndex)}
              />
            </div>
          ))}
          <Button
            type="button"
            label="Add Question"
            icon="pi pi-plus"
            className="p-button-secondary mt-3"
            onClick={addQuestion}
          />
          <Button
            type="submit"
            label="Update Test"
            icon="pi pi-check"
            className="p-button-success mt-3"
          />
        </form>
      </div>
    </div>
  );
};
export default EditTestForm;
