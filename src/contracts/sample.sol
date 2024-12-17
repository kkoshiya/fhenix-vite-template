// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@fhenixprotocol/contracts/FHE.sol";
import "@fhenixprotocol/contracts/access/Permissioned.sol";

contract Conditional is Permissioned {
    
    euint8 private _largestNumber = FHE.asEuint8(1);
    euint8 private _cipherText = FHE.asEuint8(0); 
    uint8 public plainToy = 1;

    function setCipherText(inEuint8 calldata _encryptedNumber) public  {
        _cipherText = FHE.asEuint8(_encryptedNumber);
    }

    function addCipherText(inEuint8 calldata _encryptedNumber) public {
        _cipherText = _cipherText.add(FHE.asEuint8(_encryptedNumber));
    }

    function setHighestNumber(inEuint8 calldata _encryptedNumber) public {
        euint8 _number = FHE.asEuint8(_encryptedNumber);
        //ebool is set depending on which number is greater
        ebool _greater = _number.gt(_largestNumber);
        euint8 _updated = FHE.select(_greater, _number, _largestNumber);
        _largestNumber = _updated;
    }

    function getSealedOutput(Permission memory perm) public view onlySender(perm) returns (string memory) {
        // Seal the output for a specific publicKey
        return FHE.sealoutput(_largestNumber, perm.publicKey);
    }

    function addToyPlain() public {
        plainToy++;
    }

}

