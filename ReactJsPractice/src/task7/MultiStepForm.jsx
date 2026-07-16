import { useState } from "react"


const MultiStepForm = () => {
    const [step, setStep] = useState(1);
    const [success, setSuccess] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        dob: "",
        username: "",
        password: "",
        confirmPassword: ""
    })
    const [errors, setErrors] = useState({
        fullName: "",
        email: "",
        dob: "",
        username: "",
        password: "",
        confirmPassword: ""
    })
    const isStepOneValid = () => {
        if (formData.fullName.trim() === "") {
            return false;
        }
        if (formData.email.trim() === "" || (!formData.email.includes('@'))) {
            return false;
        }
        if (formData.dob.trim() === "") {
            return false;
        }
        return true
    }

    const isStepTwoValid = () => {
        if (formData.username.trim() === "") {
            return false;
        }
        if (formData.password.trim() === "") {
            return false;
        }
        if (formData.confirmPassword.trim() === "") {
            return false;
        }
        return true
    }

    const validateStepOne = () => {
        const newErrors = {
            fullName: "",
            email: "",
            dob: ""
        }
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (formData.fullName.trim() === "") {
            newErrors.fullName = "Fullname is Required"
        }
        if (
            formData.email.trim() === "" ||
            !emailRegex.test(formData.email)
        ) {
            newErrors.email = "Enter a valid email";
        }
        if (formData.dob.trim() === "") {
            newErrors.dob = "Date of Birth is required";
        } else {

            const today = new Date();
            const birthDate = new Date(formData.dob);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();
            if (
                monthDifference < 0 ||
                (monthDifference === 0 && today.getDate() < birthDate.getDate())
            ) {
                age--;
            }
            if (age < 18) {
                newErrors.dob = "age must be 18";
            }
        }

        setErrors(newErrors)
        console.log(newErrors);

        return (
            newErrors.fullName === "" &&
            newErrors.email === "" &&
            newErrors.dob === ""
        );
    }

    const validateStepTwo = () => {
        const newErrors = {
            username: "",
            password: "",
            confirmPassword: ""
        }

        if (formData.username.trim() !== formData.username || formData.username.length < 4) {
            newErrors.username = "There are spaces in username"
        }
        if (
            formData.password.trim() === "" || formData.password.length < 8 || (!/\d/.test(formData.password))) {
            newErrors.password = "Invalid Password format(length >=8 and should Contain a number) ";
        }
        if (formData.confirmPassword.trim() !== formData.password) {
            newErrors.confirmPassword = "Passwords Don't match";
        }

        setErrors({ ...errors, ...newErrors })
        console.log(newErrors);

        return (
            newErrors.username === "" &&
            newErrors.password === "" &&
            newErrors.confirmPassword === ""
        );
    }

    const handleNext = (e) => {
        e.preventDefault();
        console.log("clicked");

        if (step == 1) {
            if (validateStepOne()) {
                setStep(2)
            }
        } else if (step == 2) {
            if (validateStepTwo()) {
                setStep(3)
            }
        }else if (step==3) {
            console.log(formData);
            setSuccess("Data successfully submitted")
        }

    }

    const handleBack = (e) => {
        e.preventDefault();
        if (step == 3) {
            setStep(2)
        } else if (step == 2) {
            setStep(1)
        }
    }


    if (step === 1) {
        return (
            <div className="flex items-center flex-col">
                <h1 className="text-center  text-2xl font-bold">Enter Your Details</h1>
                <form className="border-4 border-amber-700 p-10 flex flex-col items-center justify-center gap-2">
                    <label htmlFor="">Enter Your FullName</label>
                    <input className="border p-2" type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                    {errors.fullName && (
                        <p className="text-red-500 text-sm">
                            {errors.fullName}
                        </p>
                    )}
                    <label htmlFor="">Enter Your Email id</label>
                    <input className="border p-2" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    {errors.email && (
                        <p className="text-red-500 text-sm">
                            {errors.email}
                        </p>
                    )}
                    <label htmlFor="">Enter Your Date of Birth</label>
                    <input className="border p-2" type="date" required value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />
                    {errors.dob && (
                        <p className="text-red-500 text-sm">
                            {errors.dob}
                        </p>
                    )}
                    <button onClick={handleNext} disabled={!isStepOneValid()} className={`px-3 py-2 text-white ${!isStepOneValid() ? "bg-gray-400" : "bg-black"}`}>Next</button>
                </form>

            </div>
        )
    }


    if (step === 2) {
        return (
            <div className="flex items-center flex-col">
                <h1 className="text-center  text-2xl font-bold">Enter Your Details</h1>
                <form className="border-4 border-amber-700 p-10 flex flex-col items-center justify-center gap-2">
                    <label htmlFor="">Enter Your username</label>
                    <input className="border p-2" type="text" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                    {errors.username && (
                        <p className="text-red-500 text-sm">
                            {errors.username}
                        </p>
                    )}
                    <label htmlFor="">Enter Your Password</label>
                    <input className="border p-2" type="text" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    {errors.password && (
                        <p className="text-red-500 text-sm">
                            {errors.password}
                        </p>
                    )}
                    <label htmlFor="">Confirm Your Password</label>
                    <input className="border p-2" type="text" required value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">
                            {errors.confirmPassword}
                        </p>
                    )}
                    <button onClick={handleNext} disabled={!isStepTwoValid()} className={`px-3 py-2 text-white ${!isStepTwoValid() ? "bg-gray-400" : "bg-black"}`}>Next</button>
                </form>

            </div>
        )
    }


    if (step === 3) {
        return (
            <div className="flex items-center flex-col">
                <h1 className="text-center  text-2xl font-bold">Enter Your Details</h1>
                <form className="border-4 border-amber-700 p-10 flex flex-col items-center justify-center gap-2">
                    <table border="1">
                        <tr><th>Name   :</th><td>{formData.fullName}</td></tr>
                        <tr><th>Email  :</th><td>{formData.email}</td></tr>
                        <tr><th>Date OF Birth  :</th><td>{formData.dob}</td></tr>
                        <tr><th>UserName  :</th><td>{formData.username}</td></tr>
                        <tr><th>Password  :</th><td>{formData.password}</td></tr>
                        <tr><th>ConfirmPassword  :</th><td>{formData.confirmPassword}</td></tr>
                        
                    </table>
                    <button onClick={handleNext}  className={`px-3 py-2 text-white  bg-black`}>submit</button>
                    <button onClick={handleBack}  className={`px-3 py-2 text-white bg-black`}>Back</button>
                    {success && <p>{success}</p>}
                </form>

            </div>
        )
    }

}

export default MultiStepForm
