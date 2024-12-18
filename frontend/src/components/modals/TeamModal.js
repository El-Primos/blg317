import React, { useState, useRef } from 'react';
import UseUnsavedChangesWarning from '../UseUnsavedChangesWarning';
import { Sidebar } from 'primereact/sidebar';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames';

export default function TeamModal({
    team_id,
    name,
    nickname,
    abbreviation,
    owner,
    general_manager,
    headcoach,
    city_id,
    arena_id,
    year_founded,
    facebook,
    instagram,
    twitter,
    logo_url,
    visible,
    setVisible,
    type,
}) {
    const toast = useRef(null);
    const [warningVisible, setWarningVisible] = useState(false);

    const fields = [
        { name: 'name', type: 'text', label: 'Team Name' },
        { name: 'nickname', type: 'text', label: 'Nickname' },
        { name: 'abbreviation', type: 'text', label: 'Abbreviation' },
        { name: 'owner', type: 'text', label: 'Owner' },
        { name: 'general_manager', type: 'text', label: 'General Manager' },
        { name: 'headcoach', type: 'text', label: 'Headcoach' },
        { name: 'city_id', type: 'number', label: 'City' },
        { name: 'arena_id', type: 'number', label: 'Arena' },
        { name: 'year_founded', type: 'number', label: 'Year Founded' },
        { name: 'facebook', type: 'url', label: 'Facebook', icon: 'fa-brands fa-facebook-f' },
        { name: 'instagram', type: 'url', label: 'Instagram', icon: 'pi pi-instagram' },
        { name: 'twitter', type: 'url', label: 'Twitter', icon: 'pi pi-twitter' },
        { name: 'logo_url', type: 'url', label: 'Logo Url', icon: 'pi pi-image' },
    ];

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Team Name can't be empty."),
        nickname: Yup.string().required("Nickname can't be empty."),
        abbreviation: Yup.string().required("Abbreviation can't be empty."),
        owner: Yup.string().required("Owner can't be empty."),
        general_manager: Yup.string().required("General Manager can't be empty."),
        headcoach: Yup.string().required("Headcoach can't be empty."),
        city_id: Yup.number()
            .required("City can't be empty.")
            .test('test-city', 'City can not be 0.', function (value) {
                return value !== 0;
            }),
        arena_id: Yup.number()
            .required("Arena can't be empty.")
            .test('test-arena', 'Arena can not be 0.', function (value) {
                return value !== 0;
            }),
        year_founded: Yup.number()
            .required("Year Founded can't be empty.")
            .test('test-year', 'Year Founded can not be 0.', function (value) {
                return value !== 0;
            }),
    });

    const formik = useFormik({
        initialValues: {
            name: name || '',
            nickname: nickname || '',
            abbreviation: abbreviation || '',
            owner: owner || '',
            general_manager: general_manager || '',
            headcoach: headcoach || '',
            city_id: city_id || 0,
            arena_id: arena_id || 0,
            year_founded: year_founded || 0,
            facebook: facebook || '',
            instagram: instagram || '',
            twitter: twitter || '',
            logo_url: logo_url || '',
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (data) => {
            handleSubmit(data);
        },
    });
    const { values, initialValues } = formik;

    const handleSubmit = (data) => {
        const changedData = Object.keys(data).reduce((acc, key) => {
            if (data[key] !== initialValues[key]) {
                acc[key] = data[key];
            }
            return acc;
        }, {});

        fetch(`http://127.0.0.1:5000/api/admin/teams/${team_id || 0}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(changedData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success)
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: data.message,
                        life: 3000,
                    });
                else
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'An error occurred while deleting team',
                        life: 3000,
                    });
            })
            .catch((error) => console.log(error))
            .finally(() => {
                formik.resetForm();
                setVisible(false);
            });
    };

    const isFormFieldValid = (fieldName) => {
        const nameParts = fieldName.split('.');
        const touchedField = nameParts.reduce((acc, part) => acc?.[part], formik.touched);
        const errorField = nameParts.reduce((acc, part) => acc?.[part], formik.errors);

        return !!(touchedField && errorField);
    };
    const getFormErrorMessage = (fieldName) => {
        const nameParts = fieldName.split('.');
        const errorField = nameParts.reduce((acc, part) => acc?.[part], formik.errors);
        return isFormFieldValid(fieldName) && <small className="p-error">{errorField}</small>;
    };

    const declareUserDecision = (userDecision) => {
        if (userDecision) {
            setWarningVisible(false);
            formik.resetForm();
            setVisible(false);
        } else {
            setWarningVisible(false);
        }
    };

    const checkForChanges = () => {
        const changes = Object.keys(values).reduce((acc, key) => {
            if (values[key] !== initialValues[key]) {
                acc[key] = values[key];
            }
            return acc;
        }, {});

        if (Object.keys(changes).length > 0) {
            setVisible(true);
            setWarningVisible(true);
        } else {
            setVisible(false);
            formik.resetForm();
        }
    };

    const fieldTemplate = (field) => {
        if (field.type === 'text') {
            return (
                <InputText
                    name={field.name}
                    value={formik.values[field.name]}
                    className={classNames({
                        'p-invalid': isFormFieldValid(field.name),
                    })}
                    onChange={(e) => {
                        formik.handleChange(e);
                    }}
                />
            );
        } else if (field.type === 'number') {
            return (
                <InputNumber
                    name={field.name}
                    value={formik.values[field.name]}
                    className={classNames({
                        'p-invalid': isFormFieldValid(field.name),
                    })}
                    useGrouping={false}
                    onChange={(e) => {
                        formik.handleChange(e.originalEvent);
                    }}
                />
            );
        } else if (field.type === 'url') {
            return (
                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">{field.icon ? <i className={field.icon}></i> : 'www'}</span>
                    <InputText
                        name={field.name}
                        value={formik.values[field.name]}
                        className={classNames({
                            'p-invalid': isFormFieldValid(field.name),
                        })}
                        onChange={(e) => {
                            formik.handleChange(e);
                        }}
                    />
                </div>
            );
        } else {
            return <></>;
        }
    };

    return (
        <>
            <UseUnsavedChangesWarning visible={warningVisible} declareUserDecision={declareUserDecision} />
            <Sidebar
                visible={visible}
                onHide={() => {
                    checkForChanges();
                }}
                position="right"
                style={{ width: '35rem' }}
            >
                <div className="modal-header flex justify-content-between">
                    <div className="flex align-items-center">
                        <i
                            className="pi pi-chevron-left mr-2 text-2xl text-primary"
                            style={{ cursor: 'pointer' }}
                            onClick={() => checkForChanges()}
                        ></i>

                        <h2 className="m-0 font-bold">{type === 'add' ? 'Add Team' : 'Edit Team'}</h2>
                    </div>

                    <Button
                        className="p-button-primary w-3"
                        type="submit"
                        label="Save"
                        onClick={(e) => {
                            formik.handleSubmit(e);
                        }}
                    />
                </div>
                <Divider />
                <div className="modal-content-container">
                    <div className="flex flex-column">
                        {fields.map((field, index) => {
                            return (
                                <div key={index} className="field flex flex-column">
                                    <label>{field.label}</label>
                                    {fieldTemplate(field)}
                                    {getFormErrorMessage(field.name)}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Sidebar>
            <Toast ref={toast} />
        </>
    );
}
