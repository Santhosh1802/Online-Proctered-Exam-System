import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AdminNavBar from "../Components/AdminNavBar";
import * as XLSX from "xlsx";
import Chart from "react-apexcharts";
import { convertToISTWithTime } from "../Utils/time";

export default function AdminViewReport({ toast }) {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_GET_ALL_TEST_ADMIN}`,
          {
            withCredentials: true,
          }
        );
        setTests(response.data.data || []);
        setError("");
      } catch (err) {
        console.error("Error fetching tests:", err);
        setError("Failed to fetch tests. Please try again later.");
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch tests!",
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [toast]);

  const handleGetReports = async () => {
    if (!selectedTest) {
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please select a test!",
        life: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_TEACHER_GET_REPORT_BY_TEST}`,
        {
          params: { test_id: selectedTest },
          withCredentials: true,
        }
      );

      if (!response.data.reports || response.data.reports.length === 0) {
        toast.current.show({
          severity: "info",
          summary: "No Reports",
          detail: "No reports found for this test!",
          life: 3000,
        });
      }

      setReportData(response.data.reports || []);
      setError("");
    } catch (err) {
      console.error("Error fetching report data:", err);
      setError("Failed to fetch reports. Please try again later.");
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch reports!",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (reportData.length === 0) {
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "No report data available to download!",
        life: 3000,
      });
      return;
    }

    try {
      const formattedData = reportData.map((report) => ({
        "Student Name": report.student_id?.name || "N/A",
        Department: report.student_id?.department || "N/A",
        Section: report.student_id?.section || "N/A",
        Batch: report.student_id?.batch || "N/A",
        Score: report.score,
        "Duration Taken": report.duration_taken,
        "Submitted At": convertToISTWithTime(report.submitted_at),
        "Noise Score": report.proctoring_report?.noise_score || 0,
        "Face Score": report.proctoring_report?.face_score || 0,
        "Mobile Score": report.proctoring_report?.mobile_score || 0,
        "Tab Score": report.proctoring_report?.tab_score || 0,
      }));

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

      XLSX.writeFile(workbook, "Exam_Reports.xlsx");

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Report downloaded successfully!",
        life: 3000,
      });
    } catch (err) {
      console.error("Error exporting Excel file:", err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to download report!",
        life: 3000,
      });
    }
  };
  const topStudents = [...reportData]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const calculateBoxPlotData = () => {
    if (reportData.length === 0) return [];

    const sortedScores = [...reportData]
      .map((r) => r.score)
      .sort((a, b) => a - b);

    const getPercentile = (arr, percentile) => {
      const index = Math.floor(percentile * arr.length);
      return arr[index] || 0;
    };

    return [
      {
        x: "Scores Distribution",
        y: [
          sortedScores[0],
          getPercentile(sortedScores, 0.25),
          getPercentile(sortedScores, 0.5),
          getPercentile(sortedScores, 0.75),
          sortedScores[sortedScores.length - 1],
        ],
      },
    ];
  };

  const boxPlotData = calculateBoxPlotData();

  const calculateAverageProctoringScores = () => {
    if (reportData.length === 0) return [0, 0, 0, 0];

    const totalNoise = reportData.reduce(
      (sum, r) => sum + (r.proctoring_report?.noise_score || 0),
      0
    );
    const totalFace = reportData.reduce(
      (sum, r) => sum + (r.proctoring_report?.face_score || 0),
      0
    );
    const totalMobile = reportData.reduce(
      (sum, r) => sum + (r.proctoring_report?.mobile_score || 0),
      0
    );
    const totalTab = reportData.reduce(
      (sum, r) => sum + (r.proctoring_report?.tab_score || 0),
      0
    );

    const count = reportData.length;

    return [
      totalNoise / count,
      totalFace / count,
      totalMobile / count,
      totalTab / count,
    ];
  };

  const averageProctoringScores = calculateAverageProctoringScores();

  const categorizeScores = () => {
    const categories = {
      "0-10": 0,
      "11-20": 0,
      "21-30": 0,
      "31-40": 0,
      "41-50": 0,
      "51-60": 0,
      "61-70": 0,
      "71-80": 0,
      "81-90": 0,
      "91-100": 0,
    };

    reportData.forEach((r) => {
      const score = r.score || 0;
      const totalQuestions = r.total_questions || 1;
      const normalizedScore = (score / totalQuestions) * 100;

      if (normalizedScore <= 10) categories["0-10"]++;
      else if (normalizedScore <= 20) categories["11-20"]++;
      else if (normalizedScore <= 30) categories["21-30"]++;
      else if (normalizedScore <= 40) categories["31-40"]++;
      else if (normalizedScore <= 50) categories["41-50"]++;
      else if (normalizedScore <= 60) categories["51-60"]++;
      else if (normalizedScore <= 70) categories["61-70"]++;
      else if (normalizedScore <= 80) categories["71-80"]++;
      else if (normalizedScore <= 90) categories["81-90"]++;
      else categories["91-100"]++;
    });

    return categories;
  };

  const scoreDistribution = categorizeScores();
  const theme = localStorage.getItem("theme");
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <AdminNavBar />

      <div style={{ marginTop: "5em", width: "80%" }}>
        <h1>View Reports</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}{" "}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Dropdown
            value={selectedTest}
            options={tests.map((test) => ({
              label: test.testname,
              value: test._id,
            }))}
            onChange={(e) => setSelectedTest(e.value)}
            placeholder="Select a Test"
            className="w-full"
            disabled={loading}
          />
          <Button
            label={loading ? "Loading..." : "Get Reports"}
            icon="pi pi-search"
            onClick={handleGetReports}
            disabled={loading}
          />
        </div>
        <Button
          label="Download Excel"
          icon="pi pi-file-excel"
          className="p-button-success"
          onClick={exportToExcel}
          style={{ marginBottom: "1rem" }}
          disabled={loading || reportData.length === 0}
        />
        <DataTable
          value={reportData}
          paginator
          rows={5}
          responsiveLayout="scroll"
        >
          <Column
            field="student_id.name"
            header="Student Name"
            filter
            filterPlaceholder="Search by name"
          />
          <Column
            field="student_id.department"
            header="Department"
            filter
            filterPlaceholder="Search by department"
          />
          <Column
            field="student_id.section"
            header="Section"
            filter
            filterPlaceholder="Search by section"
          />
          <Column
            field="student_id.batch"
            header="Batch"
            filter
            filterPlaceholder="Search by batch"
          />
          <Column
            field="score"
            header="Score"
            filter
            filterPlaceholder="Search by score"
            sortable
          />
          <Column field="duration_taken" header="Duration" />
          <Column
            field="submitted_at"
            header="Submitted At"
            body={(rowData) => new Date(rowData.submitted_at).toLocaleString()}
          />
          <Column
            field="proctoring_report.noise_score"
            header="Noise Score"
            filter
          />
          <Column
            field="proctoring_report.face_score"
            header="Face Score"
            filter
          />
          <Column
            field="proctoring_report.mobile_score"
            header="Mobile Score"
            filter
          />
          <Column
            field="proctoring_report.tab_score"
            header="Tab Score"
            filter
          />
        </DataTable>
        {reportData.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "2rem",
              marginTop: "2rem",
            }}
          >
            <div style={{ flex: "1 1 45%", maxWidth: "45%" }}>
              <h2>Top Student Scores</h2>
              <Chart
                options={{
                  chart: { id: "score-chart", toolbar: { show: false } },
                  xaxis: {
                    categories: topStudents.map(
                      (r, index) => `Student ${index + 1}`
                    ),
                    labels: {
                      style: {
                        colors: theme === "dark" ? "white" : "black",
                        fontSize: "12px",
                      },
                    },
                  },
                  yaxis: {
                    labels: {
                      style: {
                        colors: theme === "dark" ? "white" : "black",
                        fontSize: "12px",
                      },
                    },
                  },
                  tooltip: {
                    theme: theme === "dark" ? "dark" : "light",
                    style: {
                      fontSize: "12px",
                      color: theme === "dark" ? "white" : "black",
                    },
                  },
                }}
                series={[
                  { name: "Score", data: topStudents.map((r) => r.score) },
                ]}
                type="bar"
                height={350}
              />
            </div>

            <div style={{ flex: "1 1 45%", maxWidth: "45%" }}>
              <h2>Proctoring Scores</h2>
              <Chart
                options={{
                  chart: { id: "proctoring-chart", toolbar: { show: false } },
                  xaxis: {
                    categories: ["Noise", "Face", "Mobile", "Tab"],
                    labels: {
                      style: {
                        colors: theme === "dark" ? "white" : "black",
                        fontSize: "12px",
                      },
                    },
                  },
                  yaxis: {
                    labels: {
                      style: {
                        colors: theme === "dark" ? "white" : "black",
                        fontSize: "12px",
                      },
                    },
                  },
                  tooltip: {
                    theme: theme === "dark" ? "dark" : "light",
                    style: {
                      fontSize: "12px",
                      color: theme === "dark" ? "white" : "black",
                    },
                  },
                }}
                series={[
                  {
                    name: "Average Proctoring Scores",
                    data: averageProctoringScores,
                  },
                ]}
                type="radar"
                height={350}
              />
            </div>

            <div style={{ flex: "1 1 45%", maxWidth: "45%" }}>
              <h2>Score Distribution</h2>
              <Chart
                options={{
                  chart: { id: "box-chart", toolbar: { show: false } },
                  title: { text: "Score Distribution Box Plot" },
                  xaxis: {
                    categories: ["Scores"],
                    labels: {
                      style: {
                        colors: theme === "dark" ? "white" : "black",
                        fontSize: "12px",
                      },
                    },
                  },
                  yaxis: {
                    labels: {
                      style: {
                        colors: theme === "dark" ? "white" : "black",
                        fontSize: "12px",
                      },
                    },
                  },
                  tooltip: {
                    theme: theme === "dark" ? "dark" : "light",
                    style: {
                      fontSize: "12px",
                      color: theme === "dark" ? "white" : "black",
                    },
                  },
                }}
                series={[{ type: "boxPlot", data: boxPlotData }]}
                type="boxPlot"
                height={350}
              />
            </div>

            <div style={{ flex: "1 1 45%", maxWidth: "45%" }}>
              <h2>Score Breakdown</h2>
              <Chart
                options={{
                  labels: Object.keys(scoreDistribution),
                  tooltip: {
                    theme: theme === "dark" ? "dark" : "light",
                    style: {
                      fontSize: "12px",
                      color: theme === "dark" ? "white" : "black",
                    },
                  },
                }}
                series={Object.values(scoreDistribution)}
                type="pie"
                height={350}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
