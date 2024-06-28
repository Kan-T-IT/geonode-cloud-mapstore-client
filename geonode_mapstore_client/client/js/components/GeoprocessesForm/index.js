/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useEffect, useState } from "react";
import {
  getGeoprocesos,
  getListOfElements,
  getLayers,
  getNewGeoprocess,
  getListParams,
  getAccountInfo
} from "@js/api/geonode/v2/index";
import { Formik, Field, Form } from "formik";
import Spinner from "@js/components/Spinner";

function GeoprocessForm() {
  const [info, SetInfo] = useState([]);
  const [params, SetParams] = useState();
  const [layers, SetLayers] = useState();
  const [numberParams, SetNumberParams] = useState();
  const [error, SetError] = useState(null);
  const [verificationOfparameters, SetVerificationOfparameters] =
    useState(null);
  const [filter, setFilter] = useState({});
  const [token, setToken] = useState();
  const [idGeoprosess, SetIdGeoprosess] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectValue] = useState();
  const [defultValue, setDefultValue] = useState();

  const infoUser = () => {
    const info = getAccountInfo().then(({ info }) =>
      setToken(info.access_token)
    );
    return info;
  };

  const procesos = () => {
    getGeoprocesos(token).then((element) => SetInfo(element.data));
  };

  useEffect(() => {
    infoUser();
  }, []);

  useEffect(() => {
    procesos();
  }, [token]);

  const newfilter = (e, id) => {
    getListParams(e, id).then((element) => SetNumberParams(element));
  };

  const defaultOption = () => {
    setDefultValue(null);
    const datos = numberParams?.data?.map(({ etiqueta }) => ({
      [etiqueta]: null
    }));
    const objet = datos?.reduce((acc, curr) => {
      return { ...acc, ...curr };
    }, {});
    setDefultValue((prevFilter) => ({
      ...prevFilter,
      ...objet
    }));
  };

  useEffect(() => {
    defaultOption();
  }, [numberParams]);

  useEffect(() => {
    if (filter.monitor_pre && filter.att_pre) {
      newfilter(filter, idGeoprosess);
    }
  }, [filter.att_pre, filter.monitor_pre]);

  const getParameters = async (e) => {
    await getListOfElements(e).then((element) => {
      const info = element?.map(({ etiqueta }) => ({ [etiqueta]: null }));
      setDefultValue(Object.assign({}, ...info));
      SetParams(element);
    });
    const data = getLayers().then((element) => SetLayers(element));
    setLoading(false);
  };

  const getIndexes = (objeto) => {
    return Object.keys(objeto)
      .filter((key) => key.startsWith("indice_"))
      .map((key) => key.substring(7));
  };

  const removerIndices = (objeto) => {
    const nuevasClaves = Object.keys(objeto).filter(
      (key) => !key.startsWith("indice_")
    );
    return nuevasClaves.reduce((acc, key) => {
      acc[key] = objeto[key];
      return acc;
    }, {});
  };

  useEffect(() => {
    !isNaN(error) &&
      error &&
      setTimeout(function () {
        window.location.href = `/catalogue/#/gpState/${error}`;
      }, 1000);
  }, [error]);

  const dateMin = () => {
    const dateFilter = Object.keys(filter).filter(function (clave) {
      return clave.includes("start");
    });

    if (filter[dateFilter]) {
      const initialDate = new Date(filter[dateFilter]);
      initialDate.setDate(initialDate.getDate() + 1);
      const result = initialDate.toISOString().slice(0, 10);
      return result;
    }
  };

  const dateMax = () => {
    const value = new Date().toISOString().split("T")[0];
    return value;
  };
  return (
    <div className="container-form">
      <Formik
        initialValues={{}}
        onSubmit={async (values) => {
          const indices = getIndexes(values);
          const info = removerIndices(values);
          const value = {
            ...defultValue,
            ...filter,
            ...info,
            ...(indices[0] ? { indices: indices } : {})
          };
          setDefultValue(value);
          SetVerificationOfparameters(true);
          const { "monitor_pre/att_pre": _, ...newValues } = value;
          if (
            Object.values(newValues).every((valor) => valor !== null || valor)
          ) {
            getNewGeoprocess(newValues, idGeoprosess).then((element) => {
              SetError(
                element.geoprocess_id
                  ? element.geoprocess_id
                  : {
                      values: false,
                      info: element.error.replace(/[\[\].']/g, "")
                    }
              );
            });
          }
        }}
      >
        {({ resetForm }) => (
          <Form className="sub-container-form">
            <div className="select-form">
              <label htmlFor="location">
                <div className={["gn-card-title, titleParams"]}>
                  Nuevo Geoproceso
                </div>
              </label>
              <Field
                id="Geoprocesos"
                name="etiqueta"
                htmlFor="Geoprocesos"
                component="select"
                multiple={false}
                render={({ field, form: { isSubmitting } }) => (
                  <select
                    {...field}
                    id="Geoprocesos"
                    disabled={isSubmitting}
                    onChange={(e) => {
                      setLoading(true);
                      setFilter({});
                      SetError(null);
                      setDefultValue(null);
                      SetVerificationOfparameters(null);
                      getParameters(e.currentTarget.value);
                      SetIdGeoprosess(e.currentTarget.value);
                      setSelectValue(e.currentTarget.value);
                      resetForm();
                    }}
                    className="opcionForm"
                    value={selectedValue}
                  >
                    <option value={"empty"}>Seleccione un geoproceso</option>
                    {info?.map(({ id, etiqueta }) => (
                      <option key={id} value={id}>
                        {etiqueta}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
            {loading ? (
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 100
                }}
              >
                <Spinner />
              </div>
            ) : (
              <>
                {params?.map(({ description, type, id, etiqueta, options }) => (
                  <div className="select-form">
                    {type !== "parameter-group" ? (
                      <label
                        className={
                          verificationOfparameters &&
                          defultValue[etiqueta] === null
                            ? ["gn-card-title titleParams errorParams"]
                            : ["gn-card-title, titleParams"]
                        }
                        htmlFor={description}
                      >
                        {description}
                        {verificationOfparameters &&
                        defultValue[etiqueta] === null
                          ? "*"
                          : ""}
                      </label>
                    ) : null}
                    {!type.includes("layer") &&
                    !type.includes("select") &&
                    !type.includes("checkbox") ? (
                      <>
                        {type.includes("parameter-group") ? (
                          <div class="subElements-form">
                            {numberParams?.data?.map(
                              ({ description, type, etiqueta }) => (
                                <div class="subElement-form">
                                  <label
                                    class={
                                      verificationOfparameters &&
                                      defultValue[etiqueta] === null
                                        ? [
                                            "gn-card-title titleParams errorParams"
                                          ]
                                        : ["gn-card-title, titleParams"]
                                    }
                                    htmlFor={description}
                                  >
                                    {description}
                                    {verificationOfparameters &&
                                    defultValue[etiqueta] === null
                                      ? "*"
                                      : ""}
                                  </label>
                                  <Field
                                    onClick={() => {
                                      SetError(null);
                                    }}
                                    min="0"
                                    htmlFor={description}
                                    type={type}
                                    name={etiqueta}
                                  />
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <>
                            <Field
                              htmlFor={description}
                              type={type === "decimal" ? "number" : type}
                              id={id}
                              name={etiqueta}
                              onClick={() => {
                                SetError(null);
                              }}
                              min={etiqueta.includes("end") ? dateMin() : "0"}
                              max={type === "date" ? dateMax() : ""}
                              className={["titleParams opcionForm"]}
                              step="any"
                              onChange={(e) => {
                                const { value } = e.currentTarget;
                                setFilter((prevFilter) => ({
                                  ...prevFilter,
                                  [etiqueta]:
                                    type === "decimal"
                                      ? parseFloat(value)
                                      : type === "number"
                                      ? parseInt(value)
                                      : value
                                }));
                              }}
                            />
                          </>
                        )}
                      </>
                    ) : type !== "checkbox" ? (
                      <Field
                        id={id}
                        name={etiqueta}
                        htmlFor={description}
                        component={type}
                        multiple={false}
                        render={({ field, form: { isSubmitting } }) => (
                          <select
                            {...field}
                            id={id}
                            disabled={isSubmitting}
                            onChange={(e) => {
                              const { value } = e.currentTarget;
                              setFilter((prevFilter) => ({
                                ...prevFilter,
                                [etiqueta]: value
                              }));
                            }}
                            className="opcionForm"
                            onClick={() => {
                              SetError(null);
                            }}
                          >
                            <option value={"empty"}>
                              Seleccione un {description}
                            </option>
                            {options
                              ? options?.map(({ name }) => (
                                  <option value={name}>{name}</option>
                                ))
                              : layers?.datasets?.map(({ title, name }) => (
                                  <option value={name}>{title}</option>
                                ))}
                          </select>
                        )}
                      />
                    ) : (
                      options?.map(({ name }) => (
                        <div className="checkboxCointeinerForm">
                          <div className="checkboxTitleForm">{name}</div>
                          <Field
                            htmlFor={name}
                            type="checkbox"
                            id={name}
                            name={`indice_${name}`}
                            onClick={() => {
                              SetError(null);
                            }}
                          />
                        </div>
                      ))
                    )}
                  </div>
                ))}

                {params ? (
                  <button
                    className={
                      error !== null
                        ? error?.values !== false
                          ? " envButton"
                          : "errorButton"
                        : "defaultbutton"
                    }
                    type="submit"
                  >
                    Enviar
                  </button>
                ) : null}
                {error !== null &&
                  (error.values !== false ? (
                    <div class="errorMessage">
                      El geoproceso se ejecuto correctamente
                    </div>
                  ) : (
                    <div class="errorMessage">{error.info}</div>
                  ))}
              </>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default GeoprocessForm;
