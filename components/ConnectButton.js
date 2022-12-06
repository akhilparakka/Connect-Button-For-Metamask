import { useState, useEffect } from "react"

export default function ConnectButton() {
    const [walletAddress, setWalletAddress] = useState("")
    useEffect(() => {
        getCurrentWalletConnected()
        addWalletListener()
    })
    const connectWallet = async () => {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                })
                setWalletAddress(accounts[0])
                console.log(accounts[0])
            } catch (e) {
                console.log(e.message)
            }
        } else {
            /**Metamask Not  Installed */
            console.log("Please install metamask...")
        }
    }
    const getCurrentWalletConnected = async () => {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_accounts",
                })
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0])
                    console.log(accounts[0])
                } else {
                    console.log("Connect to MetaMask using the Connect button")
                }
            } catch (err) {
                console.error(err.message)
            }
        } else {
            /* MetaMask is not installed */
            console.log("Please install MetaMask")
        }
    }

    const addWalletListener = async () => {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            window.ethereum.on("accountsChanged", (accounts) => {
                setWalletAddress(accounts[0])
                console.log(accounts[0])
            })
        } else {
            /* MetaMask is not installed */
            setWalletAddress("")
            console.log("Please install MetaMask")
        }
    }

    return (
        <div className="absolute top-0 right-0 py-5 px-5">
            <button
                onClick={connectWallet}
                type="button"
                class="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            >
                <span>
                    {walletAddress && walletAddress.length > 0
                        ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`
                        : "Connect Wallet"}
                </span>
            </button>
        </div>
    )
}
