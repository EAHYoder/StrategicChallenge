import { useState, useEffect } from "react";

const dummyDebt = {
  id: 11,
  creditorName: "SOVEREIGN BANK",
  firstName: "Buffy",
  lastName: "Summers",
  minPaymentPercentage: 3.0,
  balance: 3000.0,
  checked: true,
};

function App() {
  const [debtsArr, setDebtsArr] = useState([]);
  const [checkedDebtsArr, setCheckedDebtsArr] = useState([]);
  const [balanceTotal, setBalanceTotal] = useState(0);

  //this function identifes which creditors should be in checked array and update it.
  //it is defined here so it can be used in fetch creditors and in handleCheckChange
  const updateCheckedDebts = (newDebts) => {
    //update the checked creditorArray
    const checkedDebts = newDebts.filter((debt) => {
      return debt.checked;
    });
    setCheckedDebtsArr(checkedDebts);
  };

  //fetch the creditors when the page loads
  useEffect(() => {
    const fetchDebts = async () => {
      try {
        fetch(
          "https://raw.githubusercontent.com/StrategicFS/Recruitment/master/data.json"
        )
          .then((response) => response.json())
          .then((debts) => {
            //add the checked property to each creditor
            debts.forEach((debt) => {
              debt.checked = true;
            });
            setDebtsArr(debts);

            //identify which creditors should be in checked array and update it.
            updateCheckedDebts(debts);
          });
      } catch (err) {
        console.log("Error fetching Debts: ", err);
      }
    };
    fetchDebts();
  }, []);

  //update the total balance anytime the checked array changes
  useEffect(() => {
    const total = checkedDebtsArr.reduce((runningTotal, debt) => {
      return runningTotal + debt.balance;
    }, 0);
    setBalanceTotal(total);
  }, [checkedDebtsArr]);

  //add a debt
  const addDebt = () => {
    //mkae sure the new debt to be added as the right id number
    dummyDebt.id = debtsArr.length + 1;
    const newDebts = [...debtsArr, dummyDebt];
    setDebtsArr(newDebts);
    updateCheckedDebts(newDebts);
  };

  //remove a debt
  const removeDebt = () => {
    const newDebts = [...debtsArr];
    //remove the last creditor for the array
    newDebts.pop();
    setDebtsArr(newDebts);
    updateCheckedDebts(newDebts);
  };

  const handleCheckChange = (debtToUpdate) => {
    //make a new version of the credit whcih is a copy of the old one, only the checked value is flipped
    const updatedDebt = {
      ...debtToUpdate,
      checked: !debtToUpdate.checked,
    };

    //update the creditorArray
    const updatedDebts = debtsArr.map((debt) => {
      if (debt.id === debtToUpdate.id) {
        return updatedDebt;
      }
      return debt;
    });
    setDebtsArr(updatedDebts);

    //update the checked creditorArray
    updateCheckedDebts(updatedDebts);
  };

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th>Creditor</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Min Pay %</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {debtsArr.map((debt) => {
            return (
              <tr key={debt.id}>
                <input
                  type="checkbox"
                  onChange={() => handleCheckChange(debt)}
                  checked={debt.checked}
                />
                <td> {debt.creditorName}</td>
                <td> {debt.firstName}</td>
                <td> {debt.lastName}</td>
                <td> {debt.minPaymentPercentage}</td>
                <td> {debt.balance}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td>TOTAL</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>{balanceTotal}</td>
          </tr>
        </tfoot>
      </table>
      <p>Total Row Count: {debtsArr.length}</p>
      <p>Check Row Count: {checkedDebtsArr.length}</p>
      <button onClick={addDebt}>Add Debt</button>
      <button onClick={removeDebt}>Remove Debt</button>
    </div>
  );
}

export default App;
