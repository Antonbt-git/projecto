import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageModel from "./ImageModel";
import AudioModel from "./AudioModel";
import PoseModel from "./PoseModel";

type Lib = "Pandas" | "NumPy";

type CsvData = {
  key: string;
  name: string;
  columns: string[];
  data: string[][];
  result?: string;
};

type History = {
  key: string;
  lib: Lib;
  operation: string;
  file: string;
  time: string;
  result: string;
};

type ColumnProfile = {
  name: string;
  type: "Numérica" | "Texto";
  complete: number;
  unique: number;
  average: number | null;
};

type FileStats = {
  profiles: ColumnProfile[];
  totalRows: number;
  totalCols: number;
  emptyCells: number;
  completeRows: number;
  numericCols: number;
  textCols: number;
  totalUnique: number;
  completeness: number;
};

const Dashboard = (): React.ReactElement => {
  const [section, setSection] = useState<"pandas" | "numpy" | "estadisticas" | "reports" | "imagen" | "audio" | "postura">("pandas");
  const [files, setFiles] = useState<CsvData[]>([]);
  const [history, setHistory] = useState<History[]>([]);
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const parse = (text: string): string[][] =>
    text
      .trim()
      .split(/\r?\n/)
      .map(line =>
        line
          .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
          .map(value => value.replace(/^"|"$/g, "").trim())
      );

  const loadFile = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = event => {
      const content = event.target?.result;

      if (typeof content !== "string") return;

      const matrix = parse(content);
      if (!matrix.length) return;

      setFiles(current => [
        {
          key: crypto.randomUUID(),
          name: file.name,
          columns: matrix[0],
          data: matrix.slice(1),
        },
        ...current,
      ]);
    };

    reader.readAsText(file);
  };

  const chooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    loadFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const dropFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  const updateResult = (key: string, result: string) => {
    setFiles(current =>
      current.map(file =>
        file.key === key ? { ...file, result } : file
      )
    );
  };

  const saveHistory = (
    lib: Lib,
    operation: string,
    file: CsvData,
    result: string
  ) => {
    setHistory(current => [
      {
        key: crypto.randomUUID(),
        lib,
        operation,
        file: file.name,
        time: new Date().toLocaleTimeString(),
        result,
      },
      ...current,
    ]);
  };

  const getFile = (key: string) => files.find(file => file.key === key);

  const describe = (key: string) => {
    const file = getFile(key);
    if (!file) return;

    const result =
      `DataFrame\n` +
      `Filas: ${file.data.length}\n` +
      `Columnas: ${file.columns.length}\n` +
      `Campos: ${file.columns.join(", ")}`;

    updateResult(key, result);
    saveHistory("Pandas", ".describe()", file, result);
  };

  const head = (key: string) => {
    const file = getFile(key);
    if (!file) return;

    const result = file.data
      .slice(0, 5)
      .map(row => row.join(" | "))
      .join("\n");

    updateResult(key, `Primeros registros:\n${result}`);
    saveHistory("Pandas", ".head()", file, result);
  };

  const statistics = (key: string) => {
    const file = getFile(key);
    if (!file) return;

    const index = file.columns.findIndex((_, i) =>
      file.data.some(row => row[i] !== "" && !isNaN(Number(row[i])))
    );

    if (index < 0) {
      const result = "No existen datos numéricos.";
      updateResult(key, result);
      return;
    }

    const values = file.data
      .map(row => Number(row[index]))
      .filter(value => !isNaN(value));

    const average =
      values.reduce((sum, value) => sum + value, 0) / values.length;

    const result =
      `Columna: ${file.columns[index]}\n` +
      `Promedio: ${average.toFixed(2)}\n` +
      `Máximo: ${Math.max(...values)}\n` +
      `Mínimo: ${Math.min(...values)}`;

    updateResult(key, result);
    saveHistory("NumPy", "Estadísticas", file, result);
  };

  const makeArray = (key: string) => {
    const file = getFile(key);
    if (!file) return;

    const result =
      `ndarray creado\n` +
      `Dimensiones: ${file.data.length} x ${file.columns.length}\n` +
      `Elementos: ${file.data.length * file.columns.length}`;

    updateResult(key, result);
    saveHistory("NumPy", "Crear ndarray", file, result);
  };

  const remove = (key: string) => {
    setFiles(current => current.filter(file => file.key !== key));
  };

  const isNumericValue = (value: string) => value !== "" && !isNaN(Number(value));

  const buildStats = (file: CsvData): FileStats => {
    const profiles: ColumnProfile[] = file.columns.map((column, i) => {
      const values = file.data.map(row => row[i] ?? "");
      const nonEmpty = values.filter(value => value !== "");
      const unique = new Set(nonEmpty).size;
      const numericValues = nonEmpty.filter(isNumericValue).map(Number);
      const isNumericColumn = nonEmpty.length > 0 && numericValues.length === nonEmpty.length;
      const average = isNumericColumn && numericValues.length
        ? numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length
        : null;

      return {
        name: column,
        type: isNumericColumn ? "Numérica" : "Texto",
        complete: nonEmpty.length,
        unique,
        average,
      };
    });

    const totalRows = file.data.length;
    const totalCols = file.columns.length;
    const totalCells = totalRows * totalCols;
    const filledCells = profiles.reduce((sum, profile) => sum + profile.complete, 0);
    const emptyCells = totalCells - filledCells;
    const completeRows = file.data.filter(row =>
      file.columns.every((_, i) => (row[i] ?? "") !== "")
    ).length;
    const numericCols = profiles.filter(profile => profile.type === "Numérica").length;
    const textCols = totalCols - numericCols;
    const totalUnique = profiles.reduce((sum, profile) => sum + profile.unique, 0);
    const completeness = totalCells ? Math.round((filledCells / totalCells) * 100) : 0;

    return {
      profiles,
      totalRows,
      totalCols,
      emptyCells,
      completeRows,
      numericCols,
      textCols,
      totalUnique,
      completeness,
    };
  };

  const downloadReport = (file: CsvData) => {
    const stats = buildStats(file);
    const lines = [
      `REPORTE DE ANÁLISIS`,
      `Archivo: ${file.name}`,
      `Generado: ${new Date().toLocaleString()}`,
      ``,
      `Filas: ${stats.totalRows}`,
      `Columnas: ${stats.totalCols}`,
      `Valores vacíos: ${stats.emptyCells}`,
      `Filas completas: ${stats.completeRows}`,
      `Calidad de datos: ${stats.completeness}%`,
      ``,
      `PERFIL DE COLUMNAS`,
      ...stats.profiles.map(profile =>
        `- ${profile.name} | ${profile.type} | completos: ${profile.complete} | únicos: ${profile.unique}` +
        (profile.average !== null ? ` | promedio: ${profile.average.toFixed(2)}` : "")
      ),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte-${file.name.replace(/\.csv$/i, "")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const changeSection = (value: "pandas" | "numpy" | "estadisticas" | "reports" | "imagen" | "audio" | "postura") => {
    setSection(value);
    setFiles(current => current.map(file => ({ ...file, result: undefined })));
  };
  const navigate = useNavigate();

  const menuItems: { key: typeof section; label: string }[] = [
    { key: "pandas", label: "Pandas" },
    { key: "numpy", label: "NumPy" },
    { key: "estadisticas", label: "Estadísticas" },
    { key: "reports", label: "Reportes" },
    { key: "imagen", label: "Imagen" },
    { key: "audio", label: "Audio" },
    { key: "postura", label: "Postura" },
  ];

  return (
    <div className="dash-shell">
      {/* MENÚ LATERAL */}
      <aside className="dash-sidebar">
        <div className="dash-logo">DASH<span>BOARD</span></div>

        {menuItems.map((item) => (
          <button
            key={item.key}
            className={section === item.key ? "dash-nav-btn is-active" : "dash-nav-btn"}
            onClick={() => changeSection(item.key)}
          >
            {item.label}
          </button>
        ))}
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="dash-content">

        {/* ================= PANDAS / NUMPY ================= */}
        {(section === "pandas" || section === "numpy") && (
          <>
            <div className="dash-toolbar">
              <input
                ref={input}
                type="file"
                accept=".csv"
                hidden
                onChange={chooseFile}
              />

              <div
                className={dragging ? "dash-drop is-dragging" : "dash-drop"}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={dropFile}
                onClick={() => input.current?.click()}
              >
                Suelta aquí tu archivo CSV
              </div>

              <button
                className="dash-upload-btn"
                onClick={() => input.current?.click()}
              >
                + Cargar CSV
              </button>

              <button
                className="dash-back-btn"
                onClick={() => navigate(-1)}
              >
                ← Regresar
              </button>
            </div>

            {!files.length && (
              <div className="dash-empty">
                <h2>No hay archivos</h2>
                <p>Selecciona un CSV para comenzar a trabajar.</p>
              </div>
            )}

            {files.map((file) => (
              <section key={file.key} className="dash-card">

                <header className="dash-card-header">
                  <div>
                    <h2>
                      {section === "pandas" ? "Pandas" : "NumPy"}
                    </h2>

                    <span>{file.name}</span>
                  </div>

                  <button
                    className="dash-remove-btn"
                    onClick={() => remove(file.key)}
                  >
                    Eliminar
                  </button>
                </header>

                {/* TABLA */}
                <div className="dash-table-wrap">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        {file.columns.map((column) => (
                          <th key={column}>
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {file.data.slice(0, 10).map((row, index) => (
                        <tr key={index}>
                          {file.columns.map((column, columnIndex) => (
                            <td key={column}>
                              {row[columnIndex] ?? ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* BOTONES */}
                <div className="dash-actions">

                  {section === "pandas" ? (
                    <>
                      <button
                        className="dash-action-btn"
                        onClick={() => describe(file.key)}
                      >
                        Resumen
                      </button>

                      <button
                        className="dash-action-btn"
                        onClick={() => head(file.key)}
                      >
                        Primeros datos
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="dash-action-btn"
                        onClick={() => statistics(file.key)}
                      >
                        Estadísticas
                      </button>

                      <button
                        className="dash-action-btn"
                        onClick={() => makeArray(file.key)}
                      >
                        Crear Array
                      </button>
                    </>
                  )}

                </div>

                {/* RESULTADO */}
                {file.result && (
                  <pre className="dash-result">
                    {file.result}
                  </pre>
                )}

              </section>
            ))}
          </>
        )}

        {/* ================= ESTADÍSTICAS ================= */}
        {section === "estadisticas" && (
          <>
            <div className="dash-toolbar">
              <input
                ref={input}
                type="file"
                accept=".csv"
                hidden
                onChange={chooseFile}
              />

              <div
                className={dragging ? "dash-drop is-dragging" : "dash-drop"}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={dropFile}
                onClick={() => input.current?.click()}
              >
                Suelta aquí tu archivo CSV
              </div>

              <button
                className="dash-upload-btn"
                onClick={() => input.current?.click()}
              >
                + Cargar CSV
              </button>
            </div>

            {!files.length && (
              <div className="dash-empty">
                <h2>No hay archivos</h2>
                <p>Sube un CSV para ver sus estadísticas.</p>
              </div>
            )}

            {files.map((file) => {
              const stats = buildStats(file);

              return (
                <section key={file.key} className="dash-card">
                  <header className="dash-card-header">
                    <div>
                      <h2>Estadísticas</h2>
                      <span>{file.name}</span>
                    </div>

                    <button
                      className="dash-remove-btn"
                      onClick={() => remove(file.key)}
                    >
                      Eliminar
                    </button>
                  </header>

                  <div className="dash-stats-summary">
                    <div className="dash-stat-box">
                      <strong>{stats.completeness}%</strong>
                      <span>Completitud</span>
                    </div>

                    <div className="dash-stat-box">
                      <strong>{stats.totalUnique}</strong>
                      <span>Valores únicos</span>
                    </div>

                    <div className="dash-stat-box">
                      <strong>{stats.numericCols} / {stats.textCols}</strong>
                      <span>Numéricas / Texto</span>
                    </div>

                    <div className="dash-stat-box">
                      <strong>{stats.completeRows} / {stats.totalRows}</strong>
                      <span>Filas completas</span>
                    </div>

                    <div className="dash-stat-box">
                      <strong>{stats.emptyCells}</strong>
                      <span>Valores vacíos</span>
                    </div>
                  </div>

                  <h3 style={{ fontFamily: "var(--font-display)", color: "var(--ink)", marginBottom: 10 }}>
                    Perfil de columnas
                  </h3>

                  <div className="dash-table-wrap">
                    <div className="dash-profile-row head">
                      <span>Columna</span>
                      <span>Tipo</span>
                      <span>Completos</span>
                      <span>Únicos</span>
                      <span>Promedio</span>
                    </div>

                    {stats.profiles.map((profile) => {
                      const completeness = stats.totalRows
                        ? Math.round((profile.complete / stats.totalRows) * 100)
                        : 0;

                      return (
                        <div key={profile.name} className="dash-profile-row">
                          <strong>{profile.name}</strong>
                          <span>{profile.type}</span>
                          <span>
                            {profile.complete}
                            <div className="dash-mini-bar-track">
                              <div
                                className="dash-mini-bar-fill"
                                style={{ width: `${completeness}%` }}
                              />
                            </div>
                          </span>
                          <span>{profile.unique}</span>
                          <span>{profile.average !== null ? profile.average.toFixed(2) : "-"}</span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </>
        )}

        {/* ================= REPORTES ================= */}
        {section === "reports" && (
          <>
            {!files.length && !history.length && (
              <div className="dash-empty">
                <h2>No hay reportes todavía</h2>
                <p>Sube un CSV en Pandas, NumPy o Estadísticas para generar un reporte.</p>
              </div>
            )}

            {files.map((file) => {
              const stats = buildStats(file);

              return (
                <section key={file.key} className="dash-card">
                  <div className="dash-report-head">
                    <div>
                      <div className="dash-report-eyebrow">Análisis del archivo</div>
                      <h1 style={{ margin: 0 }}>Reporte</h1>
                    </div>

                    <button
                      className="dash-download-btn"
                      onClick={() => downloadReport(file)}
                    >
                      Descargar TXT
                    </button>
                  </div>

                  <div className="dash-report-grid">
                    <div className="dash-stat-box">
                      <strong style={{ fontSize: 15, wordBreak: "break-word" }}>{file.name}</strong>
                      <span>Archivo</span>
                    </div>

                    <div className="dash-stat-box">
                      <strong>{stats.totalRows}</strong>
                      <span>Filas</span>
                    </div>

                    <div className="dash-stat-box">
                      <strong>{stats.totalCols}</strong>
                      <span>Columnas</span>
                    </div>

                    <div className="dash-stat-box">
                      <strong>{stats.emptyCells}</strong>
                      <span>Valores vacíos</span>
                    </div>

                    <div className="dash-stat-box">
                      <strong>{stats.completeRows}</strong>
                      <span>Filas completas</span>
                    </div>
                  </div>

                  <div className="dash-report-two-col">
                    <div className="dash-quality-box">
                      <h3>Calidad de datos</h3>
                      <div className="dash-quality-pct">{stats.completeness}%</div>

                      <div className="tm-bar-track">
                        <div
                          className="tm-bar-fill"
                          style={{ width: `${stats.completeness}%` }}
                        />
                      </div>

                      <p className="dash-muted" style={{ marginTop: 12 }}>
                        {stats.completeRows} de {stats.totalRows} registros están completos en todas sus columnas.
                      </p>
                    </div>

                    <div className="dash-read-box">
                      <h3>Lectura general</h3>
                      <ul>
                        <li>El archivo contiene <strong>{stats.totalRows}</strong> registros para analizar.</li>
                        <li>Se detectaron <strong>{stats.totalUnique}</strong> valores únicos entre todas las columnas.</li>
                        <li>{stats.numericCols} columnas numéricas y {stats.textCols} columnas de texto.</li>
                        {stats.emptyCells > 0 && (
                          <li>Se recomienda revisar <strong>{stats.emptyCells}</strong> valores vacíos antes de un análisis avanzado.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </section>
              );
            })}

            {!!history.length && (
              <section className="dash-card">
                <h1>Historial de operaciones</h1>

                {history.map((item) => (
                  <article key={item.key} className="dash-history">
                    <div className="dash-history-top">
                      <strong>
                        {item.lib} · {item.operation}
                      </strong>

                      <small>{item.time}</small>
                    </div>

                    <span>{item.file}</span>

                    <pre className="dash-result">
                      {item.result}
                    </pre>
                  </article>
                ))}
              </section>
            )}
          </>
        )}

        {/* ================= IMAGEN ================= */}
        {section === "imagen" && (
          <section className="dash-card">
            <ImageModel />

            <div style={{ marginTop: "25px" }}>
              <button
                className="dash-back-btn"
                onClick={() => navigate(-1)}
              >
                ← Regresar
              </button>
            </div>
          </section>
        )}

        {/* ================= AUDIO ================= */}
        {section === "audio" && (
          <section className="dash-card">
            <AudioModel />

            <div style={{ marginTop: "25px" }}>
              <button
                className="dash-back-btn"
                onClick={() => navigate(-1)}
              >
                ← Regresar
              </button>
            </div>
          </section>
        )}

        {/* ================= POSTURA ================= */}
        {section === "postura" && (
          <section className="dash-card">
            <PoseModel />

            <div style={{ marginTop: "25px" }}>
              <button
                className="dash-back-btn"
                onClick={() => navigate(-1)}
              >
                ← Regresar
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
