// MintNFT.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { Button, Form, Toast } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProjectNFT from '../abi.json'; // Replace with the correct path

const MintNFT = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [tokenId, setTokenId] = useState(null);
  const [tokenUri, setTokenUri] = useState(null);
  const [ipfsLink, setIpfsLink] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  useEffect(() => {
    const init = async () => {
      // Connect to the Ethereum provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Load the contract
      const contractAddress = '0xe5b9c6EC0FCDeC174D872B618Bd938E70608650b'; // Replace with your contract address
      const projectNFTContract = new ethers.Contract(contractAddress, ProjectNFT.abi, signer);

      // Get the current account
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const currentAccount = accounts[0];

      setContract(projectNFTContract);
      setAccount(currentAccount);
    };

    init();
  }, []);

  const onImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const uploadImageToNFTStorage = async () => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await axios.post('https://api.nft.storage/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGM5Y0Q4Y0E0NmE2ZjYyRGQwMDA4OTFDMDQ1NzM2ODY5OTRBMzEzZGQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5ODM2MzY4OTg4MCwibmFtZSI6ImZpcnN0In0.HPxUUjCbCp69_Q_2XDcs6MNy6E__R9-BtG6GiqDJ-Bo`, // Replace with your NFT.Storage API key
        },
      });

      const ipfsLink = response.data.value.cid;
      setIpfsLink(ipfsLink); // Set the IPFS link to state
      toast.success('Image uploaded to NFT.Storage');
      return ipfsLink;
    } catch (error) {
      console.error('Error uploading image to NFT.Storage:', error);
      toast.error('Error uploading image to NFT.Storage');
      throw error;
    }
  };

  const mintNFT = async () => {
    try {
      if (!imageFile || !projectName || !projectDescription) {
        toast.error('Please fill in all required fields.');
        return;
      }

      const ipfsImageLink = await uploadImageToNFTStorage();

      // Call the mintNFT function with user-inputted values
      const transaction = await contract.mintNFT(projectName, projectDescription, ipfsImageLink);

      // Wait for the transaction to be mined
      await transaction.wait();

      // Get the event emitted by the mintNFT function
      const eventFilter = contract.filters.Transfer(null, account);
      const events = await contract.queryFilter(eventFilter);

      // The last event in the array contains the information about the minted token
      const mintedTokenId = events[events.length - 1].args.tokenId;

      setTokenId(mintedTokenId.toString());

      // Construct the token URI with the dynamic IPFS link
      const tokenUri = `https://gateway.pinata.cloud/ipfs/${ipfsImageLink}`;

      // Assuming metadata contains an image link
      setTokenUri(tokenUri);
      toast.success(`NFT Minted successfully! Token ID: ${mintedTokenId}`);
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast.error('Error minting NFT');
    }
  };

  return (
    <div>
      <h2>Mint NFT</h2>
      {account && (
        <div>
          <Form>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Select Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={onImageChange} />
            </Form.Group>
            <Form.Group controlId="formProjectName" className="mb-3">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formProjectDescription" className="mb-3">
              <Form.Label>Project Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter Project Description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
          <Button onClick={mintNFT} disabled={!contract || !imageFile || !projectName || !projectDescription}>
            Mint NFT
          </Button>
          {tokenId && <p>Minted NFT with Token ID: {tokenId}</p>}
          {ipfsLink && <p>IPFS Link: {tokenUri}</p>}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default MintNFT;
