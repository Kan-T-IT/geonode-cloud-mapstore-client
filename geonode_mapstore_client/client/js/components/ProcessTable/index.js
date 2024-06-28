import React, { useState, useEffect } from "react";
import { getGeoprocess, getAccountInfo } from "@js/api/geonode/v2/index";
import Spinner from "@js/components/Spinner";
import Modal from "react-modal";
import url from "url";

const ProcessTable = () => {
  const [processData, setProcessData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [pk, setPk] = useState("");
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [token, setToken] = useState();

  const fetchData = async (pk) => {
    try {
      const info = await getAccountInfo().then(async ({ info }) => {
        setToken(info.access_token);
        const response = await getGeoprocess(info.access_token);
        console.log(response);
        if (response.data) {
          if (pk !== "" && pk !== undefined) {
            setProcessData(response.data.filter((e) => e.id === parseInt(pk)));
          } else {
            setProcessData(
              response.data.sort(
                (a, b) => new Date(b.created) - new Date(a.created)
              )
            );
          }
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    } catch (error) {
      setError(true);
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const cleanFilter = () => {
    setPk("");
    window.location = "/catalogue/#/gpState/";
    fetchData("");
    setLoading(true);
  };

  const fetchAirflowData = async () => {
    try {
      const response = await getGeoprocess();
      if (response.data) {
        setLoading(false);
        setProcessData(response.data);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const openModal = async (process) => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedProcess(null);
  };

  useEffect(() => {
    const pkInUrl = url
      .parse(window.location.href, true)
      .hash.split("#/gpState/")[1];
    if (pkInUrl) setPk(pkInUrl);
    fetchData(pkInUrl);
    const intervalId = setInterval(() => {
      fetchData(
        url.parse(window.location.href, true).hash.split("#/gpState/")[1]
      );
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };
  return (
    <div className="process-container">
      <h2 className="geprocess-title">Estados de los geoprocesos</h2>
      {loading ? (
        <Spinner />
      ) : error ? (
        "No hay geoprocesos ejecutados"
      ) : (
        <table className="process-table">
          <thead>
            <tr>
              <th>ID del Proceso</th>
              <th>Fecha de creación</th>
              <th>Estado</th>
              <th>Tipo de geoproceso</th>
              <th>Etiqueta</th>
              <th>Recursos</th>
            </tr>
          </thead>
          <tbody className="process-table">
            {processData ? (
              processData.map((process, index) => {
                return (
                  <tr
                    key={process.id}
                    className={index % 2 == 0 ? "row-white" : "row-grey"}
                  >
                    <td>{process.id}</td>
                    <td>{formatDate(process.created)}</td>
                    <td
                      className={
                        process.status === "Finalized Error"
                          ? "row-error"
                          : process.status === "In Progress"
                          ? "row-curso"
                          : "row-terminado"
                      }
                    >
                      {process.status}
                    </td>
                    <td>{process.geoprocess_type.description}</td>
                    <td>{process.geoprocess_type.etiqueta}</td>
                    <td>
                      {process.document !== "-" &&
                      process.document[0] === "{" ? (
                        <div className="td-row">
                          {JSON.parse(
                            process.document[process.document.length - 1] ===
                              ","
                              ? "[" + process.document.slice(0, -1) + "]"
                              : "[" + process.document + "]"
                          ).map((docs) => {
                            return (
                              <div>
                                {docs.type == "document" ? (
                                  <a
                                    title={"Documento con id: " + docs.id}
                                    target="_blank"
                                    href={`https://agtech.kan.com.ar/catalogue/#/document/${docs.id}`}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      class="icon icon-tabler icon-tabler-file-type-pdf"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="currentColor"
                                      fill="none"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    >
                                      <path
                                        stroke="none"
                                        d="M0 0h24v24H0z"
                                        fill="none"
                                      />
                                      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                      <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" />
                                      <path d="M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6" />
                                      <path d="M17 18h2" />
                                      <path d="M20 15h-3v6" />
                                      <path d="M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z" />
                                    </svg>
                                  </a>
                                ) : docs.type == "dataset" ? (
                                  <a
                                    title={"Capa con id: " + docs.id}
                                    target="_blank"
                                    href={`https://agtech.kan.com.ar/catalogue/#/dataset/${docs.id}`}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      class="icon icon-tabler icon-tabler-map"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="currentColor"
                                      fill="none"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    >
                                      <path
                                        stroke="none"
                                        d="M0 0h24v24H0z"
                                        fill="none"
                                      />
                                      <path d="M3 7l6 -3l6 3l6 -3v13l-6 3l-6 -3l-6 3v-13" />
                                      <path d="M9 4v13" />
                                      <path d="M15 7v13" />
                                    </svg>
                                  </a>
                                ) : (
                                  <p className="p100">"----"</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p>{"--"}</p>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <h2 className="table-title">No hay datos</h2>
            )}
          </tbody>
        </table>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Additional Data Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Fondo oscuro con opacidad
            backdropFilter: "blur(5px)", // Desenfoque
          },
          content: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "30%",
            height: "30%",
            margin: "auto",
            borderRadius: "8px",
          },
        }}
      >
        {" "}
        <div>
          <button
            onClick={closeModal}
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              cursor: "pointer",
              border: "none",
              background: "none",
              fontSize: "25px",
            }}
          >
            &times;
          </button>
          <h2>Información adicional</h2>
          {selectedProcess ? (
            <div>
              <p>{selectedProcess.geoprocess_type.etiqueta}</p>
              <p>{selectedProcess.geoprocess_type.description}</p>
            </div>
          ) : (
            <p>Cargando datos...</p>
          )}
        </div>
      </Modal>
      {pk !== "" && (
        <div style={{ margin: 10 }}>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => cleanFilter()}
          >
            Limpiar filtro
          </button>
        </div>
      )}
    </div>
  );
};

export default ProcessTable;
