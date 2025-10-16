import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		const auth = getAuth();
		try {
			await signInWithEmailAndPassword(auth, email, password);
			localStorage.setItem("adminEmail", email);
			navigate("/"); // Redirect to home
		} catch (error) {
			alert(error.message);
		}
	};

	return (
		<>
			<h1>Admin Login</h1>
			<div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
				<div className="card-down p-4" style={{ width: "100%", maxWidth: "500px", border: "none" }}>
					<h2 className="card-title text-center">Login</h2>

					<form onSubmit={handleLogin}>
						<div className="mb-3 mt-4">
							<label className="form-label w-100 text-start text-white">Email address</label>
							<input
								type="email"
								className="form-control"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>

						<div className="mb-3">
							<label className="form-label w-100 text-start text-white">Password</label>
							<input
								type="password"
								className="form-control"
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						<button type="submit" className="btn btn-danger w-50 mt-4 mb-2">
							Sign In
						</button>
					</form>
				</div>
			</div>
		</>
	);
}

export default AdminLogin;
