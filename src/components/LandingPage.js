import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import "./LandingPage.css";

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState("task_1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    task_1: [],
    task_2: [],
    task_3: [],
    users: [],
  });

  const [usersTableState, setUsersTableState] = useState({
    searchTerm: "",
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [pageInputValue, setPageInputValue] = useState(1);

  const [task2DateRange, setTask2DateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const apiEndpoints = {
    task_1: "http://localhost:5000/api/employees/latest",
    task_2: "http://localhost:5000/api/employees/above-average",
    task_3: "http://localhost:5000/api/employees/most-active-in-30-days",
    users: "http://localhost:5000/api/users/table",
  };

  const fetchData = async (tab) => {
    setLoading(true);
    setError(null);
    try {
      let url = apiEndpoints[tab];

      if (tab === "users") {
        const params = new URLSearchParams({
          page: usersTableState.currentPage.toString(),
          search: usersTableState.searchTerm,
        });
        url = `${url}?${params}`;
      } else if (tab === "task_2") {
        const params = new URLSearchParams();
        if (task2DateRange.startDate) {
          params.append("startDate", task2DateRange.startDate);
        }
        if (task2DateRange.endDate) {
          params.append("endDate", task2DateRange.endDate);
        }
        if (params.toString()) {
          url = `${url}?${params}`;
        }
      }

      const response = await axios.get(url);
      let processedData = response.data;

      if (tab === "task_1") {
        processedData = Array.isArray(response.data)
          ? response.data
          : [response.data];
      } else if (tab === "task_2") {
        processedData = Array.isArray(response.data)
          ? response.data
          : [response.data];
      } else if (tab === "task_3") {
        processedData = Array.isArray(response.data)
          ? response.data
          : [response.data];
      } else if (tab === "users") {
        processedData = response.data.data || [];
        setUsersTableState((prev) => ({
          ...prev,
          totalPages: response.data.pagination.totalPages,
          totalCount: response.data.pagination.totalCount,
          hasNextPage: response.data.pagination.hasNextPage,
          hasPreviousPage: response.data.pagination.hasPreviousPage,
        }));
      }

      setData((prev) => ({
        ...prev,
        [tab]: processedData,
      }));
    } catch (error) {
      console.error(`Error fetching ${tab} data:`, error);
      setError(
        `Failed to fetch data for ${tab}. ${
          error.response?.status === 404
            ? "API endpoint not found."
            : "Please check if the API is running."
        }`
      );
      setSampleData(tab);
    } finally {
      setLoading(false);
    }
  };

  const setSampleData = (tab) => {
    const sampleData = {
      task_1: [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "123-456-7890",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "098-765-4321",
        },
        {
          id: 3,
          name: "Bob Johnson",
          email: "bob@example.com",
          phone: "555-123-4567",
        },
      ],
      task_2: [
        { jobs_count: 22, last_name: "Thompson", name: "jeffrey" },
        { jobs_count: 18, last_name: "Johnson", name: "sarah" },
        { jobs_count: 15, last_name: "Williams", name: "michael" },
      ],
      task_3: [
        { name: "michelle", last_name: "Baker", jobs_done: 5 },
        { name: "jeffrey", last_name: "Moore", jobs_done: 4 },
        { name: "nancy", last_name: "Turner", jobs_done: 4 },
        { name: "matthew", last_name: "Nelson", jobs_done: 4 },
        { name: "sharon", last_name: "Anderson", jobs_done: 4 },
      ],
      users: [
        {
          userId: 1,
          name: "john",
          last_name: "doe",
          totalJobs: 5,
          latestJobDate: "2025-08-05T10:06:55.658305",
          jobs: [
            { job: "Frontend Developer" },
            { job: "React Specialist" },
            { job: "UI/UX Designer" },
            { job: "JavaScript Developer" },
            { job: "Web Development Consultant" },
          ],
        },
        {
          userId: 2,
          name: "jane",
          last_name: "smith",
          totalJobs: 3,
          latestJobDate: "2025-08-04T15:30:00.000000",
          jobs: [
            { job: "Backend Developer" },
            { job: "Database Administrator" },
            { job: "DevOps Engineer" },
          ],
        },
      ],
    };

    setData((prev) => ({
      ...prev,
      [tab]: sampleData[tab],
    }));
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearch = async () => {
    const searchTerm = usersTableState.searchTerm;
    setUsersTableState((prev) => ({ ...prev, currentPage: 1 }));

    if (activeTab === "users") {
      await fetchData("users");
    }
  };

  const handleSearchInputChange = (value) => {
    setUsersTableState((prev) => ({
      ...prev,
      searchTerm: value,
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= usersTableState.totalPages) {
      setUsersTableState((prev) => ({
        ...prev,
        currentPage: newPage,
      }));
      setPageInputValue(newPage);
    }
  };

  const handlePageInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) >= 1)) {
      setPageInputValue(value === "" ? "" : parseInt(value));
    }
  };

  const handleApplyPageChange = () => {
    const pageNumber = parseInt(pageInputValue) || 1;
    if (pageNumber >= 1 && pageNumber <= usersTableState.totalPages) {
      handlePageChange(pageNumber);
    } else {
      setPageInputValue(usersTableState.currentPage);
    }
  };

  const handlePageInputKeyPress = (e) => {
    if (e.key === "Enter") {
      handleApplyPageChange();
    }
  };

  const handleTask2DateChange = (field, value) => {
    setTask2DateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTask2DateFilter = () => {
    if (activeTab === "task_2") {
      fetchData("task_2");
    }
  };

  useEffect(() => {
    if (activeTab === "users") {
      fetchData("users");
    }
  }, [usersTableState.currentPage]);

  useEffect(() => {
    setPageInputValue(usersTableState.currentPage);
  }, [usersTableState.currentPage]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return (
        date.toISOString().split("T")[0] +
        " " +
        date.toTimeString().split(" ")[0]
      );
    } catch (error) {
      return dateString;
    }
  };

  const renderTable = (data, columns) => (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id || index}>
              <td className="row-number">{index + 1}</td>
              {columns.map((col) => (
                <td key={col.key}>
                  {(() => {
                    const value = row[col.key];

                    if (col.key === "jobs" && Array.isArray(value)) {
                      if (value.length === 0) {
                        return "No jobs";
                      }

                      const jobNames = value.map((job) => {
                        if (typeof job === "object" && job !== null) {
                          return (
                            job.job ||
                            job.title ||
                            job.name ||
                            job.jobTitle ||
                            job.position ||
                            JSON.stringify(job)
                          );
                        }
                        return job;
                      });

                      const fullText = jobNames.join(", ");
                      const maxLength = 30;

                      if (fullText.length <= maxLength) {
                        return (
                          <div
                            className="jobs-cell-container"
                            onMouseEnter={(e) => {
                              const tooltip =
                                e.currentTarget.querySelector(".jobs-tooltip");
                              console.log("Tooltip:", tooltip);
                              const rect =
                                e.currentTarget.getBoundingClientRect();

                              const tooltipWidth = tooltip.offsetWidth || 250;
                              const leftPosition =
                                rect.left + rect.width / 2 - tooltipWidth / 2;

                              const topPosition = rect.top - 10;

                              const adjustedLeft = Math.max(
                                10,
                                Math.min(
                                  leftPosition,
                                  window.innerWidth - tooltipWidth - 10
                                )
                              );

                              tooltip.style.left = adjustedLeft + "px";
                              tooltip.style.top = topPosition + "px";
                              tooltip.style.transform = "translateY(-100%)";
                              tooltip.style.visibility = "visible";
                              tooltip.style.opacity = "1";
                            }}
                            onMouseLeave={(e) => {
                              const tooltip =
                                e.currentTarget.querySelector(".jobs-tooltip");
                              tooltip.style.visibility = "hidden";
                              tooltip.style.opacity = "0";
                              tooltip.style.top = "-9999px";
                              tooltip.style.left = "-9999px";
                            }}
                          >
                            <span className="jobs-text">{fullText}</span>
                            <div className="jobs-tooltip">
                              <ul>
                                {jobNames.map((job, idx) => (
                                  <li key={idx}>{job}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        );
                      }

                      const truncated =
                        fullText.substring(0, maxLength) + "...";
                      return (
                        <div
                          className="jobs-cell-container"
                          onMouseEnter={(e) => {
                            const cell = e.currentTarget;
                            const tt = cell.querySelector(".jobs-tooltip");

                            // 1) Reveal it so offsetWidth is correct
                            tt.style.visibility = "visible";
                            tt.style.opacity = "1";
                            tt.style.width = "300px";

                            // 2) Switch to fixed positioning
                            tt.style.position = "fixed";

                            // 3) Grab dimensions
                            const rect = cell.getBoundingClientRect();
                            const ttWidth = tt.offsetWidth;
                            const ttHeight = tt.offsetHeight;
                            const buffer = 10; // min distance from edges

                            // 4) Compute X: center tooltip over the cell, clamp to viewport
                            const centerX =
                              rect.left + rect.width / 2 - ttWidth / 2;
                            const leftClamped = Math.max(
                              buffer,
                              Math.min(
                                centerX,
                                window.innerWidth - ttWidth - buffer
                              )
                            );

                            // 5) Compute Y: pop it just above the cell
                            const topPos = rect.top - buffer;

                            // 6) Apply
                            tt.style.left = `${leftClamped}px`;
                            tt.style.top = `${topPos}px`;
                          }}
                          onMouseLeave={(e) => {
                            const tt =
                              e.currentTarget.querySelector(".jobs-tooltip");
                            tt.style.visibility = "hidden";
                            tt.style.opacity = "0";
                            tt.style.top = "-9999px";
                            tt.style.left = "-9999px";
                          }}
                        >
                          <span className="jobs-text">{truncated}</span>
                          <div className="jobs-tooltip">
                            <ul>
                              {jobNames.map((job, idx) => (
                                <li key={idx}>{job}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    }

                    if (typeof value === "object" && value !== null) {
                      return JSON.stringify(value);
                    }
                    const valueString = value?.toString() || "N/A";
                    if (
                      valueString !== "N/A" &&
                      (valueString.includes("T") ||
                        valueString.match(/^\d{4}-\d{2}-\d{2}/) ||
                        valueString.match(/^\d{2}\/\d{2}\/\d{4}/) ||
                        col.key.toLowerCase().includes("date") ||
                        col.key.toLowerCase().includes("time") ||
                        col.key.toLowerCase().includes("created") ||
                        col.key.toLowerCase().includes("updated"))
                    ) {
                      return formatDate(valueString);
                    }
                    return valueString;
                  })()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderTask1Content = () => {
    const getColumnsFromData = (data) => {
      if (!data || data.length === 0) return [];
      const firstItem = data[0];
      return Object.keys(firstItem).map((key) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace("_", " "),
      }));
    };

    const columns =
      data.task_1.length > 0
        ? getColumnsFromData(data.task_1)
        : [
            { key: "id", label: "ID" },
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
          ];
    console.log("Columns for Task 1:", data.task_1);
    return (
      <div className="tab-content">
        <h2>
          Task 1 - Grąžina top 10 darbuotojų, kurie paskutiniai atliko darbą
          pateikiant jų vardą, pavardę ir specializacijos pavadinimą.
        </h2>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          renderTable(data.task_1, columns)
        )}
      </div>
    );
  };

  const renderTask2Content = () => {
    const getColumnsFromData = (data) => {
      if (!data || data.length === 0) return [];
      const firstItem = data[0];
      return Object.keys(firstItem).map((key) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace("_", " "),
      }));
    };

    const columns =
      data.task_2.length > 0
        ? getColumnsFromData(data.task_2)
        : [
            { key: "name", label: "Name" },
            { key: "last_name", label: "Last Name" },
            { key: "jobs_count", label: "Jobs Count" },
          ];

    const chartData = data.task_2.map((employee) => ({
      name: `${employee.name} ${employee.last_name}` || "Employee",
      jobs_count: employee.jobs_count || 0,
    }));

    return (
      <div className="tab-content">
        <h2>
          Task 2 - Grąžina top 5 darbuotojus, kurių atliktų darbų kiekis yra
          didesnis negu vidutinis visų darbuotojų atliktų darbų kiekis per tą
          patį laikotarpį, pateikiant vardą, pavardę ir darbų kiekį.
        </h2>
        {error && <div className="error-message">{error}</div>}

        {/* Date Range Filter */}
        <div className="search-container">
          <div className="date-range-container">
            <label>Start Date:</label>
            <input
              type="date"
              value={task2DateRange.startDate}
              onChange={(e) =>
                handleTask2DateChange("startDate", e.target.value)
              }
              className="date-input"
            />
            <label>End Date:</label>
            <input
              type="date"
              value={task2DateRange.endDate}
              onChange={(e) => handleTask2DateChange("endDate", e.target.value)}
              className="date-input"
            />
            <button onClick={handleTask2DateFilter} className="search-button">
              Filter
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div className="chart-container">
              <h3>Jobs Count by Employee</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="jobs_count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {renderTable(data.task_2, columns)}
          </>
        )}
      </div>
    );
  };

  const renderTask3Content = () => {
    const getColumnsFromData = (data) => {
      if (!data || data.length === 0) return [];
      const firstItem = data[0];
      return Object.keys(firstItem).map((key) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace("_", " "),
      }));
    };

    const columns =
      data.task_3.length > 0
        ? getColumnsFromData(data.task_3)
        : [
            { key: "name", label: "Name" },
            { key: "last_name", label: "Last Name" },
            { key: "jobs_done", label: "Jobs Done" },
          ];

    const chartData = data.task_3.map((employee) => ({
      name: `${employee.name} ${employee.last_name}` || "Employee",
      jobs_done: employee.jobs_done || 0,
    }));

    const pieData = data.task_3.slice(0, 5).map((employee) => ({
      name: `${employee.name} ${employee.last_name}`,
      value: employee.jobs_done,
    }));

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

    return (
      <div className="tab-content">
        <h2>
          Task 3 - Grąžina top 5 darbuotojus, kurių atliktų darbų kiekis per
          paskutinius 30 dienų yra didesnis nei jų pačių atliktų darbų vidurkis
          per pastaruosius 6 mėnesius, pateikiant vardą, pavardę ir darbų kiekį.
        </h2>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div className="charts-grid">
              <div className="chart-container">
                <h3>Jobs Done by Employee</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="jobs_done" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3>Jobs Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            {renderTable(data.task_3, columns)}
          </>
        )}
      </div>
    );
  };

  const renderUsersContent = () => {
    const columns = [
      { key: "userId", label: "User ID" },
      { key: "name", label: "Name" },
      { key: "last_name", label: "Last Name" },
      { key: "totalJobs", label: "Total Jobs" },
      { key: "jobs", label: "Jobs" },
      { key: "latestJobDate", label: "Latest Job Date" },
    ];

    return (
      <div className="tab-content">
        <h2>Users Management</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            value={usersTableState.searchTerm}
            onChange={(e) => handleSearchInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {renderTable(data.users, columns)}

            <div className="pagination-container">
              <div className="pagination-info">
                <span>
                  Showing page {usersTableState.currentPage} of{" "}
                  {usersTableState.totalPages} ({usersTableState.totalCount}{" "}
                  total users)
                </span>
              </div>
              <div className="pagination-controls">
                <button
                  onClick={() =>
                    handlePageChange(usersTableState.currentPage - 1)
                  }
                  disabled={!usersTableState.hasPreviousPage}
                  className="pagination-button"
                >
                  Previous
                </button>

                <div className="page-input-container">
                  <span>Go to page:</span>
                  <input
                    type="number"
                    min="1"
                    max={usersTableState.totalPages}
                    value={pageInputValue}
                    onChange={handlePageInputChange}
                    onKeyPress={handlePageInputKeyPress}
                    className="page-input"
                  />
                  <span>of {usersTableState.totalPages}</span>
                  <button
                    onClick={handleApplyPageChange}
                    className="apply-page-button"
                  >
                    Apply
                  </button>
                </div>

                <button
                  onClick={() =>
                    handlePageChange(usersTableState.currentPage + 1)
                  }
                  disabled={!usersTableState.hasNextPage}
                  className="pagination-button"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="landing-page">
      <header className="header">
        <h1>API Data Dashboard</h1>
        <p>View and analyze data from multiple API endpoints</p>
      </header>

      <nav className="tabs-nav">
        <button
          className={`tab-button ${activeTab === "task_1" ? "active" : ""}`}
          onClick={() => handleTabChange("task_1")}
        >
          Task 1
        </button>
        <button
          className={`tab-button ${activeTab === "task_2" ? "active" : ""}`}
          onClick={() => handleTabChange("task_2")}
        >
          Task 2
        </button>
        <button
          className={`tab-button ${activeTab === "task_3" ? "active" : ""}`}
          onClick={() => handleTabChange("task_3")}
        >
          Task 3
        </button>
        <button
          className={`tab-button ${activeTab === "users" ? "active" : ""}`}
          onClick={() => handleTabChange("users")}
        >
          Users
        </button>
      </nav>

      <main className="content">
        {activeTab === "task_1" && renderTask1Content()}
        {activeTab === "task_2" && renderTask2Content()}
        {activeTab === "task_3" && renderTask3Content()}
        {activeTab === "users" && renderUsersContent()}
      </main>

      <footer className="footer">
        <button
          className="refresh-button"
          onClick={() => fetchData(activeTab)}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh Data"}
        </button>
      </footer>
    </div>
  );
};

export default LandingPage;
