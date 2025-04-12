const contractAddress = "0x51D6C3EEd42846cE2B58Ab17852D3D3E158E6924";
const abi =  [
	{
		"inputs": [
			{
				"internalType": "uint16",
				"name": "classId",
				"type": "uint16"
			},
			{
				"internalType": "uint16",
				"name": "timing",
				"type": "uint16"
			}
		],
		"name": "assignClass",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "classId",
				"type": "uint8"
			}
		],
		"name": "cancelClass",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint16",
				"name": "",
				"type": "uint16"
			}
		],
		"name": "classes",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint16",
				"name": "timing",
				"type": "uint16"
			},
			{
				"internalType": "bool",
				"name": "isAssigned",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getStudentSchedule",
		"outputs": [
			{
				"internalType": "uint16[]",
				"name": "",
				"type": "uint16[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "studentSchedule",
		"outputs": [
			{
				"internalType": "uint16",
				"name": "",
				"type": "uint16"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let web3;
let contract;

async function loadBlockchainData() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        contract = new web3.eth.Contract(abi, contractAddress);
        document.getElementById("status").innerText = "Connected to blockchain!";
    } else {
        document.getElementById("status").innerText = "Please install MetaMask.";
    }
}

async function assignClass() {
    const classId = document.getElementById("classSelect").value;
    const timing = document.getElementById("timeSelect").value;
    const accounts = await web3.eth.getAccounts();

    try {
        await contract.methods.assignClass(parseInt(classId), parseInt(timing))
            .send({ from: accounts[0] });
        document.getElementById("status").innerText = "Class assigned successfully!";
        viewSchedule(); // Refresh schedule
    } catch (error) {
        document.getElementById("status").innerText = "Error: " + error.message;
    }
}

async function cancelClass() {
    const classId = document.getElementById("classSelect").value;
    const accounts = await web3.eth.getAccounts();

    try {
        await contract.methods.cancelClass(parseInt(classId)).send({ from: accounts[0] });
        document.getElementById("status").innerText = "Class cancelled successfully!";
        viewSchedule(); // Refresh schedule
    } catch (error) {
        document.getElementById("status").innerText = "Error: " + error.message;
    }
}

async function viewSchedule() {
    const accounts = await web3.eth.getAccounts();
    try {
        const schedule = await contract.methods.getStudentSchedule().call({ from: accounts[0] });
        const scheduleList = document.getElementById("scheduleList");
        scheduleList.innerHTML = "";

        const timeLabels = ["8 AM", "11 AM", "2 PM", "6 PM"];

        if (schedule.length === 0) {
            scheduleList.innerHTML = "<li>No classes scheduled.</li>";
        } else {
            schedule.forEach(time => {
                let li = document.createElement("li");
                li.innerText = "Class at " + timeLabels[time];
                scheduleList.appendChild(li);
            });
        }
    } catch (error) {
        document.getElementById("status").innerText = "Error: " + error.message;
    }
}

window.onload = loadBlockchainData;
