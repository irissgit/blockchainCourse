pragma solidity >0.5.0;


contract Donation  {
    struct Donator {
        bool donated;
        uint[] donatedtargets; 
        uint donateIndex; 
        uint num;

    }

    struct DonateTarget {
        string name;   
        uint amount;    
    }

    mapping(address => Donator) public Donators;
    address[] public donatorHash;
    DonateTarget[] public donatetargets;
    uint numberofdonate=0;

    event NewDonate(
        address donator,
        string targerName
    );

    function donation() public {

    }

    function getTargetName(uint index) public view returns (string memory) {

       return donatetargets[index].name;
   }
   function getTargetAmount(uint index) public view returns (uint) {

       return donatetargets[index].amount;
   }
   


    function targetsCount() public view returns (uint) {
        return donatetargets.length;
    }

    function donatorsHashCount() public view returns (uint) {
        return donatorHash.length;
    }

    function getnumberofdonate() public view returns (uint) {
        return numberofdonate;
    }

    function getTargetAmount(string memory name ) public view returns (uint) {
        uint amount = 0;
        for (uint i = 0; i < donatetargets.length; i++) {
            if(keccak256(abi.encodePacked(name)) == keccak256(abi.encodePacked(donatetargets[i].name)))
            {
                amount=donatetargets[i].amount;
            }
        }
        return amount;
    }

    function getTotalDonation() public view returns (uint) {
        uint total=0;
        for (uint i = 0; i < donatetargets.length; i++) {
            total+=donatetargets[i].amount;
        }
        return total;
    }

    function addTarget(string memory name)  public {
        donatetargets.push(DonateTarget({
            name: name,
            amount: 0
        }));
    }

    function donate(address donator, uint targetindex,uint count)  public returns (bool) {
        uint size=targetsCount();
        require(size>targetindex);
        require(targetindex>=0);


        Donator storage sender = Donators[donator];

        if (sender.donated != true) {
          sender.donateIndex = donatorHash.length;
          donatorHash.push(donator);
          sender.donated=true;
        }
        sender.donatedtargets.push(targetindex);
        sender.num=count;

        donatetargets[targetindex].amount+=count;

        emit NewDonate(donator, donatetargets[targetindex].name);

        numberofdonate++;

        return true;
    }

}
