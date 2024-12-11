import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { username, mail, password } = await request.json();

        const apiResponse = await fetch('http://127.0.0.1:5000/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, mail, password }),
        });

        if (apiResponse.ok) {
            const response = NextResponse.json({ success: true, message: 'Signup succesfull' }, { status: 200 });
            return response;
        }

        return apiResponse;
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
