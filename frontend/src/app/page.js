'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';

function Page() {
    const router = useRouter();

    return (
        <div className="h-auto">
            <div className="grid mt-1 w-full bg-primary">
                <div className="col-8 col-offset-2">
                    <div className="text-center p-3 border-round-sm  font-bold">NBA-DATABASE PROJECT</div>
                </div>
            </div>
            <div className="grid mt-0 w-10 mx-auto bg-primary-reverse">
                <div className="mt-0 py-1 col-12 lg:col-2">
                    <Button
                        className="mt-0 bg-primary h-full w-full font-bold text-center w-full"
                        onClick={() => {
                            router.push('/countries');
                        }}
                        label="Countries"
                    >
                        {' '}
                    </Button>
                </div>
                <div className="mt-0 py-1 col-12 lg:col-2">
                    <Button
                        className="mt-0 bg-primary h-full w-full font-bold text-center w-full"
                        onClick={() => {
                            router.push('/teams');
                        }}
                        label="Teams"
                    >
                        {' '}
                    </Button>
                </div>
                <div className="mt-0 py-1 col-12 lg:col-2">
                    <Button
                        className="mt-0 bg-primary h-full w-full font-bold text-center w-full"
                        onClick={() => {
                            router.push('/countries');
                        }}
                        label="Countries"
                    >
                        {' '}
                    </Button>
                </div>
                <div className="mt-0 py-1 col-12 lg:col-2">
                    <Button
                        className="mt-0 bg-primary h-full w-full font-bold text-center w-full"
                        onClick={() => {
                            router.push('/countries');
                        }}
                        label="Countries"
                    >
                        {' '}
                    </Button>
                </div>
                <div className="mt-0 py-1 col-12 lg:col-4">
                    <Button
                        className="mt-0 bg-primary h-full w-full font-bold text-center w-full"
                        onClick={() => {
                            router.push('/countries');
                        }}
                        label="Countries"
                    >
                        {' '}
                    </Button>
                </div>
            </div>
            <div className="prime-flex h-30rem mt-2 w-10 mx-auto justify-content-center align-content-center fadeindown animation-ease-in animation-duration-1000 surface-ground">
                <div className="text-2xl md:text-4xl lg:text-8xl text-center text-color">
                    <div>Welcome To Home Page!</div>
                </div>
            </div>
        </div>
    );
}

export default Page;
