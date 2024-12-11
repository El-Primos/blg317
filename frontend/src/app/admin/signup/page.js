'use client';

import { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';

export default function signup() {
    const toast = useRef(null);
    const router = useRouter();

    const goToLogIn = () => {
        router.push('/admin/login');
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required("Username can't be empty."),
        mail: Yup.string().email("Invalid email format").required("Mail can't be empty."),
        password: Yup.string().required("Password can't be empty."),
        confirmPassword: Yup.string().test('test-password', 'Passwords does not match.', function (value) {
            return value === formik.values.password;
        }),
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            mail: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (data) => {
            console.log(data);
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
        fetch('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ username: formikData.username, mail: formikData.mail, password: formikData.password }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("DATA in auth: ", data);
                if (data.success) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Your account has been created successfully.',
                        life: 3000,
                    });

                    setTimeout(() => {
                        router.push('/admin/login'); // Redirect after successful login
                    }, 2000);
                } else {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: data.error,
                        life: 3000,
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'An error occurred while creating your account',
                    life: 3000,
                });
            });
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
                        <div className="text-center p-3 border-round-sm font-bold">SIGN UP</div>
                    </div>
                    <div className="col-4 md:col-2"></div>
                </div>
            </div>
            <div className="flex justify-content-center w-full">
                <div className="flex flex-column justify-content-center">
                    <div className="p-fluid flex flex-column mt-8" onSubmit={(e) => submitHandler(e)}>
                        <div className="mb-3">
                            <span className="mx-2">Username</span>
                            <InputText
                                id="username"
                                value={formik.values.username}
                                className={classNames({
                                    'p-invalid': isFormFieldValid('username'),
                                })}
                                onChange={formik.handleChange}
                            />
                            {getFormErrorMessage('username')}
                        </div>
                        <div className="mb-3">
                            <span className="mx-2">Mail</span>
                            <InputText
                                id="mail"
                                name="mail"
                                value={formik.values.mail}
                                className={classNames({
                                    'p-invalid': isFormFieldValid('mail'),
                                })}
                                onChange={formik.handleChange}
                            />
                            {getFormErrorMessage('mail')}
                        </div>
                        <span className="mx-2">Password</span>
                        <div className="mb-3">
                            <Password
                                id="password"
                                feedback={false}
                                invalid={isFormFieldValid('password')}
                                value={formik.values.password}
                                onChange={formik.handleChange('password')}
                                toggleMask
                            />

                            {getFormErrorMessage('password')}
                        </div>
                        <span className="mx-2">Confirm Password</span>
                        <div className="mb-1">
                            <Password
                                id="confirmPassword"
                                feedback={false}
                                invalid={isFormFieldValid('confirmPassword')}
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange('confirmPassword')}
                                toggleMask
                            />
                            {getFormErrorMessage('confirmPassword')}
                        </div>
                        <Button
                            type="submit"
                            className="m-auto mt-4 w-full"
                            label="Sign Up"
                            onClick={formik.handleSubmit}
                        ></Button>
                        <Toast ref={toast} />
                    </div>
                    <div className="flex flex-row align-items-center mt-6">
                        <span>Do you have an account</span>
                        <img src="/mousydog.png" className="w-3rem" alt="mousydog" />
                        <span>,&nbsp;</span>
                        <span className="link" onClick={goToLogIn}>
                            Come to Log
                        </span>
                        <img src="/coolface.png" className="w-3rem" alt="coolface" />
                    </div>
                </div>
            </div>
        </div>
    );
}
