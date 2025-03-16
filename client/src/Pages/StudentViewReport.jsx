import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentNavBar from "../Components/StudentNavBar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { convertToISTWithTime } from "../Utils/time";

export default function StudentViewReport() {
  const [reports, setReports] = useState([]);
  const [student, setStudent] = useState({});
  const [testDetailsMap, setTestDetailsMap] = useState({});

  const student_id = useSelector((state) => state.user.id);
  const userEmail = useSelector((state) => state.user.email);

  useEffect(() => {
    if (!userEmail) return;
    axios
      .get(process.env.REACT_APP_GET_STUDENT_DATA, {
        params: { email: userEmail },
        withCredentials: true,
      })
      .then((response) => {
        setStudent(response.data.data);
      })
      .catch((error) => console.error("Error fetching student data:", error));
  }, [userEmail]);

  useEffect(() => {
    if (!student_id) return;
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_STUDENT_GET_ALL_REPORT}?student_id=${student_id}`,
          { withCredentials: true }
        );
        if (response.data && Array.isArray(response.data.reports)) {
          setReports(response.data.reports);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, [student_id]);

  useEffect(() => {
    if (reports.length === 0) return;

    const fetchTestDetails = async () => {
      try {
        const testIds = [...new Set(reports.map((report) => report.test_id))]; // Unique test IDs
        const testRequests = testIds.map((id) =>
          axios.get(`${process.env.REACT_APP_STUDENT_GET_ONE_TEST}?id=${id}`, {
            withCredentials: true,
          })
        );

        const responses = await Promise.all(testRequests);
        const detailsMap = {};
        responses.forEach((res) => {
          if (res.data && res.data.data) {
            detailsMap[res.data.data._id] = res.data.data;
          }
        });

        setTestDetailsMap(detailsMap);
      } catch (error) {
        console.error("Error fetching test details:", error);
      }
    };

    fetchTestDetails();
  }, [reports]);

  const downloadPDFReport = (report) => {
    const testDetails = testDetailsMap[report.test_id];

    if (!testDetails || !testDetails.questions) {
      console.error("Error: Test details or questions are missing.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Student Test Report", 14, 15);
    doc.setFontSize(12);

    let currentY = 25;

    const totalScore = testDetails.questions?.length
      ? testDetails.questions.reduce((sum, question) => sum + (question.marks || 1), 0)
      : "N/A";

    doc.setFontSize(14);
    doc.text("Test Details", 14, currentY);
    doc.setFontSize(12);
    currentY += 7;
    doc.text(`Test Name: ${report.testname || "N/A"}`, 14, currentY);
    currentY += 6;
    doc.text(`Total Duration: ${testDetails.duration || "N/A"} min`, 14, currentY);
    currentY += 6;
    doc.text(`Total Score: ${totalScore}`, 14, currentY);
    currentY += 10;

    doc.setFontSize(14);
    doc.text("Student Details", 14, currentY);
    doc.setFontSize(12);
    currentY += 7;
    doc.text(`Name: ${student?.name || "N/A"}`, 14, currentY);
    currentY += 6;
    doc.text(`Email: ${student?.email || "N/A"}`, 14, currentY);
    currentY += 6;
    doc.text(`Submitted At: ${convertToISTWithTime(report.submitted_at) || "N/A"}`, 14, currentY);
    currentY += 10;

    doc.setFontSize(14);
    doc.text("Test Performance Details", 14, currentY);
    doc.setFontSize(12);
    currentY += 7;
    doc.text(`Score: ${report?.score || "N/A"} / ${totalScore}`, 14, currentY);
    currentY += 6;
    doc.text(`Duration Taken: ${report?.duration_taken || "N/A"} min`, 14, currentY);
    currentY += 10;

    if (testDetails.proctor_settings?.length > 0) {
      autoTable(doc, {
        startY: currentY,
        head: [["Proctoring Category", "Penalty Score"]],
        body: [
          ["Noise Score", report?.proctoring_report?.noise_score ?? "N/A"],
          ["Face Score", report?.proctoring_report?.face_score ?? "N/A"],
          ["Mobile Score", report?.proctoring_report?.mobile_score ?? "N/A"],
          ["Tab Score", report?.proctoring_report?.tab_score ?? "N/A"],
        ],
      });
      currentY = doc.lastAutoTable.finalY + 10;
    }

    if (report.flags?.length > 0) {
      autoTable(doc, {
        startY: currentY,
        head: [["Flagged Activities"]],
        body: report.flags.map((flag) => [flag]),
      });
      currentY = doc.lastAutoTable.finalY + 10;
    }

    if (report.answers && Object.keys(report.answers).length > 0) {
      const questionTable = Object.entries(report.answers).map(([questionId, answer]) => {
        const questionObj = testDetails.questions?.find((q) => q._id === questionId);
        return [
          questionObj?.questionText || "Unknown Question",
          Array.isArray(answer) ? answer.join(", ") : answer?.toString() || "N/A",
          questionObj?.correctAnswers?.join(", ") || "N/A",
        ];
      });

      autoTable(doc, {
        startY: currentY,
        head: [["Question", "Your Answer", "Correct Answer"]],
        body: questionTable,
      });
    }

    doc.save(`Report_${report.testname || "Unknown"}_${student?.name || "Student"}.pdf`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <StudentNavBar />
      <div style={{ marginTop: "10vh", width: "90%" }}>
        <h1 style={{ textAlign: "center", marginBottom: "1em" }}>Test Reports</h1>
        {reports.length > 0 ? (
          <DataTable value={reports} paginator rows={5} responsiveLayout="scroll">
            <Column field="testname" header="Test Name" sortable />
            <Column field="score" header="Score" sortable />
            <Column field="duration_taken" header="Duration Taken" />
            <Column field="submitted_at" header="Submitted At" body={(rowData) => convertToISTWithTime(rowData.submitted_at)} />
            <Column
              header="Download"
              body={(rowData) => (
                <Button
                  label="Download PDF"
                  icon="pi pi-download"
                  className="p-button-sm p-button-secondary"
                  onClick={() => downloadPDFReport(rowData)}
                />
              )}
            />
          </DataTable>
        ) : (
          <p style={{ textAlign: "center" }}>No reports found.</p>
        )}
      </div>
    </div>
  );
}
