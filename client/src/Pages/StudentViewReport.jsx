import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentNavBar from "../Components/StudentNavBar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function StudentViewReport() {
  const [reports, setReports] = useState([]);
  const student_id = useSelector((state) => state.user.id);
  const userEmail = useSelector((state) => state.user.email);
  const [student, setStudents] = useState({});
  const [testDetails, setTestDetails] = useState({});
  useEffect(() => {
    const fetchTestDetails = async () => {
      if (reports.length === 0) return;
  
      try {
        for (const report of reports) {
          if (!report.test_id) continue;
  
          const response = await axios.get(`${process.env.REACT_APP_STUDENT_GET_ONE_TEST}?id=${report.test_id}`, {
            withCredentials: true,
          });
  
          if (response.data) {
            setTestDetails(response.data.data);
          }
        }
  
      } catch (error) {
        console.error("Error fetching test details:", error);
      }
    };
  
    fetchTestDetails();
  }, [reports]);  
  if (userEmail) {
    axios.get(process.env.REACT_APP_GET_STUDENT_DATA, {
      params: { email: userEmail },
      withCredentials: true,
    })
    .then((response)=>{
      setStudents(response.data.data);
    })
  }
  useEffect(() => {
    const fetchReports = async () => {
      if (!student_id) return; // Prevent API calls if student_id is undefined

      try {
        const apiUrl = process.env.REACT_APP_STUDENT_GET_ALL_REPORT;
        console.log("Fetching reports from:", apiUrl);

        const response = await axios.get(`${apiUrl}?student_id=${student_id}`, {
          withCredentials: true,
        });

        if (response.data && Array.isArray(response.data.reports)) {
          setReports(response.data.reports);
        } else {
          console.warn("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, [student_id]);

  // Function to generate and download the PDF report
  // Function to generate and download the PDF report
  const downloadPDFReport = (report) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Student Test Report", 14, 15);
    doc.setFontSize(12);
    doc.text(`Test Name: ${report.testname}`, 14, 25);
    doc.text(`Student Name: ${student.name}`, 14, 35);
    doc.text(`Score: ${report.score}`, 14, 45);
    doc.text(`Duration Taken: ${report.duration_taken} minutes`, 14, 55);
    doc.text(
      `Submitted At: ${new Date(report.submitted_at).toLocaleString()}`,
      14,
      65
    );
  
    let currentY = 75; // Track Y position manually
  
    // Check if the test had proctoring enabled
    if (testDetails.proctor_settings && testDetails.proctor_settings.length > 0) {
      autoTable(doc, {
        startY: currentY,
        head: [["Category", "Penalty"]],
        body: [
          ["Noise Score", report.proctoring_report?.noise_score || "N/A"],
          ["Face Score", report.proctoring_report?.face_score || "N/A"],
          ["Mobile Score", report.proctoring_report?.mobile_score || "N/A"],
          ["Tab Score", report.proctoring_report?.tab_score || "N/A"],
        ],
      });
      currentY = doc.lastAutoTable?.finalY + 10 || currentY + 20;
    } else {
      // Mention that the test had no proctoring
      doc.text("No proctoring was enabled for this test.", 14, currentY);
      currentY += 10;
    }
  
    // Proctoring Flags Table (if any flags exist)
    if (report.flags && report.flags.length > 0) {
      autoTable(doc, {
        startY: currentY,
        head: [["Flagged Activities"]],
        body: report.flags.map((flag) => [flag]),
      });
      currentY = doc.lastAutoTable?.finalY + 10 || currentY + 20;
    }
  
    // Answers Table with Correct Answers
    if (report.answers && Object.keys(report.answers).length > 0) {
      const questionTable = Object.entries(report.answers).map(
        ([questionId, answer]) => {
          const questionObj = testDetails.questions?.find(
            (q) => q._id.toString() === questionId
          );
  
          const questionText = questionObj?.questionText || "Unknown Question";
          const correctAnswers = questionObj?.correctAnswers || [];
          const formattedCorrectAnswers =
            correctAnswers.length > 0 ? correctAnswers.join(", ") : "N/A";
  
          return [
            questionText,
            Array.isArray(answer) ? answer.join(", ") : answer.toString(),
            formattedCorrectAnswers,
          ];
        }
      );
  
      autoTable(doc, {
        startY: currentY,
        head: [["Question", "Student Answer", "Correct Answer"]],
        body: questionTable,
      });
    }
  
    doc.save(`Report_${report.testname}_${student.name}.pdf`);
  };
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <StudentNavBar />
      <div style={{ marginTop: "10vh", width: "90%" }}>
        <h1 style={{ textAlign: "center", marginBottom: "1em" }}>
          Test Reports
        </h1>
        {reports.length > 0 ? (
          <DataTable
            value={reports}
            paginator
            rows={5}
            responsiveLayout="scroll"
          >
            <Column field="testname" header="Test Name" sortable />
            <Column field="score" header="Score" sortable />
            <Column
              field="proctoring_report.noise_score"
              header="Noise Penalty"
              sortable
            />
            <Column
              field="proctoring_report.face_score"
              header="Face Penalty"
              sortable
            />
            <Column
              field="proctoring_report.mobile_score"
              header="Mobile Penalty"
              sortable
            />
            <Column
              field="proctoring_report.tab_score"
              header="Tab Penalty"
              sortable
            />
            <Column field="duration_taken" header="Duration Taken" />
            <Column
              field="submitted_at"
              header="Submitted At"
              body={(rowData) =>
                new Date(rowData.submitted_at).toLocaleString()
              }
            />
            {/* Download PDF Button Column */}
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
