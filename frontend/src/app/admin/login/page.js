'use client';

import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const toast = useRef(null);
    const router = useRouter();

    const goToSignUp = () => {
        router.push('/admin/signup');
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required("Username can't be empty."),
        password: Yup.string().required("Password can't be empty."),
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (data) => {
            handleSubmit(data);
        },
    });

    const isFormFieldValid = (name) => {
        const nameParts = name.split('.');
        const touchedField = nameParts.reduce((acc, part) => acc?.[part], formik.touched);
        const errorField = nameParts.reduce((acc, part) => acc?.[part], formik.errors);

        return !!(touchedField && errorField);
    };
    const getFormErrorMessage = (name) => {
        const nameParts = name.split('.');
        const errorField = nameParts.reduce((acc, part) => acc?.[part], formik.errors);
        return isFormFieldValid(name) && <small className="p-error">{errorField}</small>;
    };

    const handleSubmit = (formikData) => {
        fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ ...formikData }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    toast.current.show({
                        severity: 'succes',
                        summary: 'Succes',
                        detail: 'Successfully logged in',
                        life: 3000,
                    });
                    router.replace('/admin');
                } else {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Invalid Credentials',
                        detail: 'Please check your username and password',
                        life: 3000,
                    });
                }
            })
            .catch((error) => console.log(error));
    };

    return (
        <div className="flex flex-column justify-content-center">
            <div className="top">
                <div className="grid mt-1 mx-auto w-10 bg-primary-reverse">
                    <div className="col-4 md:col-2">
                        <Button
                            className="mt-0 bg-primary h-full w-full font-bold text-center w-full"
                            onClick={() => {
                                router.replace('/');
                            }}
                            label="Home"
                        >
                            {' '}
                        </Button>
                    </div>
                    <div className="col-4 md:col-8">
                        <div className="text-center p-3 border-round-sm font-bold">LOG IN</div>
                    </div>
                    <div className="col-4 md:col-2"></div>
                </div>
            </div>
            <div className="flex justify-content-center w-full">
                <div className="flex flex-column justify-content-center">
                    <div className="p-fluid flex flex-column mt-8" onSubmit={(e) => submitHandler(e)}>
                        <div className="mb-3">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"></i>
                                </span>
                                <InputText
                                    id="username"
                                    placeholder="username"
                                    className={classNames({
                                        'p-invalid': isFormFieldValid('username'),
                                    })}
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            {getFormErrorMessage('username')}
                        </div>
                        <div className="mb-1">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-key"></i>
                                </span>
                                <Password
                                    id="password"
                                    placeholder="password"
                                    invalid={isFormFieldValid('password')}
                                    feedback={false}
                                    value={formik.values.password}
                                    onChange={formik.handleChange('password')}
                                    toggleMask
                                />
                            </div>
                            {getFormErrorMessage('password')}
                        </div>
                        <Button className="m-auto mt-4 w-full" label="Log In" onClick={formik.handleSubmit}></Button>
                        <Toast ref={toast} />
                    </div>
                    <div className="flex flex-row align-items-center mt-6">
                        <span>Don't you have an account</span>
                        <img src="/mousydog.png" className="w-3rem" alt="mousydog" />
                        <span>,&nbsp;</span>
                        <span className="link" onClick={goToSignUp}>
                            Let's Sign
                        </span>
                        <img src="/coolface.png" className="w-3rem" alt="coolface" />
                    </div>
                </div>
            </div>
        </div>
    );
}
