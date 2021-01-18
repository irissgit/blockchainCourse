import Web3 from "web3";
import donation_artifacts from "../../build/contracts/Donation.json";

let accounts
let account
var test = new Vue({
    el: '#ta',
    data: {
        targets: []
    }
})
var donates = new Vue({
    el: '#donatedetail',
    data: {
        details: []
    }
})

const App = {
    web3: null,
    account: null,
    meta: null,

    start: async function() {
        const { web3 } = this;

        try {
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = donation_artifacts.networks[networkId];
            this.meta = new web3.eth.Contract(
                donation_artifacts.abi,
                deployedNetwork.address
            );
            console.log(typeof(deployedNetwork))
            console.log(deployedNetwork.address)
            const accounts = await web3.eth.getAccounts();
            this.account = accounts[0];
            this.loadStudentsInfomation();
        } catch (error) {
            console.error("Could not connect to contract or chain.");
        }
    },

    donates: async function() {
        let index = parseInt($("#index").val());
        let address = $("#address").val();
        let amount = parseInt($("#amount").val());

        if (index >= test.targets.length) {
            alert("该目标不存在");
            return;
        }
        console.log(index);
        console.log(address);
        console.log(amount);

        const { donate } = this.meta.methods;
        await donate(address, index, amount).send({ from: this.account });

        var message = { from: address, to: account, value: web3.toWei(amount, 'ether') };
        web3.eth.sendTransaction(message, (err, res) => {
            if (err) {
                alert("余额不足");
                return;
            } else {
                console.log(res);
                test.targets[index].amount += amount;
                console.log("aaa");
                donates.details.push({ target: test.targets[index].name, address: address, amount: amount, transact: res });
                alert("转账成功")
            }
        });

    },

    addTargets: async function() {
        let targerName = $("#targetname").val();
        if (targerName.length == 0) {
            alert("请输入投资目标");
            return;
        }
        test.targets.push({ name: targerName, index: test.targets.length, amount: 0 });
        const { addTarget } = this.meta.methods;
        await addTarget(targerName).send({ from: this.account });

    },

    loadStudentsInfomation: async function() {},

    setStatus: function(message) {
        const status = document.getElementById("status");
        status.innerHTML = message;
    },
};

window.App = App;

window.addEventListener("load", function() {
    if (window.ethereum) {
        App.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
    } else {
        console.warn(
            "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live"
        );
        App.web3 = new Web3(
            new Web3.providers.HttpProvider("http://127.0.0.1:8545")
        );
    }

    App.start();
});