import React, { useEffect, useState } from "react";
//create your first component
const Home = () => {
	function _handleKeyDown(e) {
		if (e.key === "Enter") {
			addToDos();
			setInputValue("");
		}
	}
	const [inputValue, setInputValue] = useState("");
	const [toDos, setTodos] = useState([]);
	const [isShown, setIsShown] = useState(false);
	function getToDos() {
		fetch("https://assets.breatheco.de/apis/fake/todos/user/Donducci", {
			method: "GET",
		})
			.then((res) => res.json())
			.then((toDosFromApi) => {
				setTodos(toDosFromApi);
				console.log(toDosFromApi)
			});
	}
	function addToDos() {
		fetch("https://assets.breatheco.de/apis/fake/todos/user/Donducci", {
			method: "PUT",
			body: JSON.stringify([
				...toDos,
				{
					label: inputValue,
					done: false,
				},
			]),
			headers: {
				"Content-Type": "application/json",
			},
		}).then((response) => {
			if (!response.ok) throw new Error("couldn't fetch data");
			getToDos();
		});
	}
	useEffect(() => {
		getToDos();
	}, []);
	return (
		<div className="container">
			{(toDos.length === 0) ? (
				<div className="d-flex flex-column">
					<div className="row">
						<input placeholder={"Username"} type="text"/>
					</div>
					<div className="row">
						<button className="btn btn primary">
							{"Creat User"}
						</button>
					</div>
				</div>
			) : (
				<React.Fragment>
			<h1 className="text-center">TODOS</h1>
			<div className="notePad">
				<ul className="w-100">
					<li>
						<input
							type="text"
							id="addToDo"
							placeholder="Add task"
							onKeyDown={_handleKeyDown}
							onChange={(e) => setInputValue(e.target.value)}
							value={inputValue}
						/>
					</li>
					{toDos.map((item, index) => (
						<li
							key={index}
							onMouseEnter={() => setIsShown(true)}
							onMouseLeave={() => setIsShown(false)}
							className="w-100 d-flex"
						>
							<p className="w-auto">{item.label}</p>
							{isShown === true ? (
								<i
									className="fa-solid fa-xmark ms-auto"
									onClick={() => {
										//if the list.length==1 fetch delete
										if (toDos.length == 1) {
											fetch(
												"https://assets.breatheco.de/apis/fake/todos/user/Donducci",
												{
													method: "DELETE",
												}
											).then((response) => {
												if (response.ok) setTodos([]);
											});
										} else {
											fetch(
												"https://assets.breatheco.de/apis/fake/todos/user/Donducci",
												{
													method: "PUT",
													body: JSON.stringify(
														toDos.filter((toDo, currentIndex) => {
															return currentIndex !== index;
														})
													),
													headers: {
														"Content-Type": "application/json",
													},
												}
											).then((response) => {
												if (!response.ok)
													throw new Error("couldn't fetch data");
												getToDos();
											});
										}
									}}
								></i>
							) : (
								""
							)}
						</li>
					))}
				</ul>
				<div> {toDos.length} item left</div>
			</div>
			</React.Fragment>
			)}
		</div>
	);
};

export default Home;
