// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Web3 Education Completion Certificate
 * @notice ERC-721 NFT minted when a user completes a course module.
 * @dev Mint fee is configurable by owner. Deploy on Base for low gas.
 */
contract CertificateNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    uint256 public mintFee;

    event CertificateMinted(address indexed to, uint256 tokenId, string moduleId);

    constructor(uint256 _mintFee)
        ERC721("Web3 Education Certificate", "W3CERT")
        Ownable(msg.sender)
    {
        mintFee = _mintFee;
    }

    function mint(string calldata tokenURI_, string calldata moduleId) external payable {
        require(msg.value >= mintFee, "Insufficient mint fee");
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI_);
        emit CertificateMinted(msg.sender, tokenId, moduleId);
    }

    function setMintFee(uint256 _mintFee) external onlyOwner {
        mintFee = _mintFee;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
