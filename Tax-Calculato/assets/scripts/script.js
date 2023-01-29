// inputs
let periodMonthly = document.querySelector("#monthly");
let periodYearly = document.querySelector("#yearly");
let salaryInput = document.querySelector(".incomeinput");
let benefitsInput = document.querySelector(".benefitsInput");
let addBenefitsInput = document.querySelector(".addBenefits");
let salary = document.querySelector(".incomeinput");
let nhifCheckbox = document.querySelector("#nhif");
let nssfCheckbox = document.querySelector("#nssf");
let nssfOld = document.querySelector("#old_rate");
let nssfTiered = document.querySelector("#tiered_rate");
let submit = document.querySelector("#calculate");
let emptyField = document.querySelector("#emptyfield");
let alertMessage = document.querySelector(".alert");
let analyze = document.querySelector(".doing_math");
let output = document.querySelector(".output");
let openView = document.querySelector("#output");
let scroller = document.querySelector(".bounce");
let Relief = 2400;
let lowerLimit = 6000;
let upperLimit = 18000;
let NSSFFee, NSSFoldRate, NSSFTieredRate, NSSFPercentage, NHIFFee, Benefits;

// change period
let periodState = true;
periodMonthly.addEventListener("click", () => {
  periodState = true;
  periodMonthly.style.color = "#ffffff";
  periodMonthly.style.backgroundColor = "#6090ff";
  periodYearly.style.color = "#003c6e";
  periodYearly.style.backgroundColor = "rgba(255, 255, 255, 0.57)";
});

periodYearly.addEventListener("click", () => {
  periodState = false;
  periodMonthly.style.color = " #003c6e";
  periodMonthly.style.backgroundColor = " rgba(255, 255, 255, 0.57)";
  periodYearly.style.color = "#ffffff";
  periodYearly.style.backgroundColor = "#6090ff";
});

// functions
const montlySalary = () => {
  let salary;
  if (salaryInput.value !== "" && Number(salaryInput.value) >= 1000) {
    emptyField.innerHTML = "";
    emptyField.classList.add("hide");

    salary = Number(salaryInput.value);
  } else {
    emptyField.classList.remove("hide");
    emptyField.innerHTML = `<span id="empty_field">This Field cannot be empty. Enter Values greater than 999</span>`;
    // return;
  }
  return salary;
};

const nssfTieredFee = () => {
  NSSFTieredRate = 0;
  NSSFPercentage = 0.06;
  if (montlySalary() < lowerLimit) {
    NSSFTieredRate = NSSFTieredRate;
  } else if (montlySalary() > upperLimit) {
    NSSFTieredRate = 2160;
  } else {
    NSSFTieredRate = montlySalary() * NSSFPercentage;
  }
  return NSSFTieredRate;
};

let state = false;
nssfCheckbox.addEventListener("click", () => {
  state = !state;
  nssfOld.value = "false";
  if (state) {
    nssfOld.value = "true";
  } else {
    nssfOld.value = "false";
  }
  if (nssfOld.checked !== !nssfOld.checked) {
    nssfOld.checked = !nssfOld.checked;
  }
});

nssfTiered.addEventListener("click", () => {
  if (state === false) {
    if (nssfOld.checked !== !nssfOld.checked) {
      nssfTiered.checked = !nssfTiered.checked;
      nssfOld.checked != !nssfOld.checked;
    }
  } else {
    nssfOld.checked = !nssfOld.checked;
  }
});

nssfOld.addEventListener("click", () => {
  nssfOld.checked = !nssfOld.checked;
});

const calculateNSSFFee = () => {
  NSSFoldRate = 200;
  if (state !== false) {
    alertMessage.innerHTML = "";
    alertMessage.classList.add("hide");
    if (nssfOld.checked === true) {
      if (montlySalary() >= lowerLimit) {
        NSSFFee = NSSFoldRate;
      } else {
        NSSFFee = 0;
      }
    } else {
      NSSFFee = nssfTieredFee();
    }
  } else {
    alertMessage.classList.remove("hide");
    alertMessage.innerHTML = `<span id="alert_message">Please check this box before proceeding</span>`;
    return;
  }
  return NSSFFee;
};

const calculateIncomeAfterPension = () => {
  let incomeAvailable = 0;
  if (montlySalary() >= lowerLimit) {
    incomeAvailable = montlySalary() - calculateNSSFFee();
  } else return montlySalary();
  return incomeAvailable;
};

const calculateBenefits = () => {
  Benefits = 0;
  if (montlySalary() >= lowerLimit) {
    if (benefitsInput.value !== "" && addBenefitsInput.value !== "") {
      Benefits = Number(benefitsInput.value) + Number(addBenefitsInput.value);
    } else if (benefitsInput.value !== "" && addBenefitsInput.value === "") {
      Benefits = Number(benefitsInput.value);
    } else if (benefitsInput.value === "" && addBenefitsInput.value !== "") {
      Benefits = Number(addBenefitsInput.value);
    } else {
      Benefits = 0;
    }
  } else {
    Benefits = Benefits;
  }
  return Benefits;
};

const calculateTaxableIncome = () => {
  let taxableIncome = 0;
  taxableIncome = calculateIncomeAfterPension() + calculateBenefits();
  return taxableIncome;
};

const calculateTaxOnTaxableIncome = () => {
  let tax;
  let taxIncome = calculateTaxableIncome() + 2400;
  let fll = 6000;
  let ful = 12298;
  let sll = 12299;
  let sul = 23885;
  let tll = 23886;
  let tul = 35472;
  let foll = 35473;
  let foul = 47059;
  let classWidth = 11586;
  switch (true) {
    case taxIncome >= fll && taxIncome < sll:
      tax = taxIncome * 0.1;
      break;
    case taxIncome > ful && taxIncome < tll:
      tax = ful * 0.1;
      tax += (taxIncome - ful) * 0.15;
      break;
    case taxIncome > sul && taxIncome < foll:
      tax = ful * 0.1 + classWidth * 0.15;
      tax += (taxIncome - sul) * 0.2;
      break;
    case taxIncome > tul && taxIncome < foul:
      tax = ful * 0.1 + classWidth * 0.15 + classWidth * 0.2;
      tax += (taxIncome - tul) * 0.25;
      break;
    case taxIncome > foul:
      tax =
        ful * 0.1 + classWidth * 0.15 + classWidth * 0.2 + classWidth * 0.25;
      tax += (taxIncome - foul) * 0.3;
      break;
    default:
      tax = 0;
  }

  return tax.toFixed(2);
};

const checkRelief = () => {
  let relevantRelief = 0;
  if (montlySalary() < 24000) {
    relevantRelief = calculateTaxOnTaxableIncome();
  } else {
    relevantRelief = Relief;
  }
  return relevantRelief;
};

const calculateTaxAfterRelief = () => {
  let taxAfterRelief = 0;
  taxAfterRelief = calculateTaxOnTaxableIncome() - checkRelief();
  return taxAfterRelief;
};

let newState = false;
nhifCheckbox.addEventListener("click", () => {
  newState = !newState;
  if (newState === true) {
    caclulateNHIFFee();
  } else {
    NHIFFee = 0;
  }
});

const caclulateNHIFFee = () => {
  NHIFFee = 0;
  if (nhifCheckbox.checked === true) {
    switch (true) {
      case calculateTaxableIncome() > 1000 && calculateTaxableIncome() <= 5999:
        NHIFFee = 150;
        break;
      case calculateTaxableIncome() > 5999 && calculateTaxableIncome() <= 7999:
        NHIFFee = 300;
        break;
      case calculateTaxableIncome() > 7999 && calculateTaxableIncome() <= 11999:
        NHIFFee = 400;
        break;
      case calculateTaxableIncome() > 11999 &&
        calculateTaxableIncome() <= 14999:
        NHIFFee = 500;
        break;
      case calculateTaxableIncome() > 14999 &&
        calculateTaxableIncome() <= 19999:
        NHIFFee = 600;
        break;
      case calculateTaxableIncome() > 19999 &&
        calculateTaxableIncome() <= 24999:
        NHIFFee = 750;
        break;
      case calculateTaxableIncome() > 24999 &&
        calculateTaxableIncome() <= 29999:
        NHIFFee = 850;
        break;
      case calculateTaxableIncome() > 29999 &&
        calculateTaxableIncome() <= 34999:
        NHIFFee = 900;
        break;
      case calculateTaxableIncome() > 34999 &&
        calculateTaxableIncome() <= 39999:
        NHIFFee = 950;
        break;
      case calculateTaxableIncome() > 39999 && calculateTaxableIncome() < 44999:
        NHIFFee = 1000;
        break;
      case calculateTaxableIncome() > 44999 &&
        calculateTaxableIncome() <= 49999:
        NHIFFee = 1100;
        break;
      case calculateTaxableIncome() > 49999 &&
        calculateTaxableIncome() <= 59999:
        NHIFFee = 1200;
        break;
      case calculateTaxableIncome() > 59999 &&
        calculateTaxableIncome() <= 69999:
        NHIFFee = 1300;
        break;
      case calculateTaxableIncome() > 69999 &&
        calculateTaxableIncome() <= 79999:
        NHIFFee = 1400;
        break;
      case calculateTaxableIncome() > 79999 &&
        calculateTaxableIncome() <= 89999:
        NHIFFee = 1500;
        break;
      case calculateTaxableIncome() > 89999 && calculateTaxableIncome() < 99999:
        NHIFFee = 1600;
        break;
      case calculateTaxableIncome() > 99999:
        NHIFFee = 1700;
        break;
    }
  } else NHIFFee = NHIFFee;

  return NHIFFee;
};

const calculateNetPay = () => {
  let NetPay = 0;
  if (montlySalary() >= lowerLimit) {
    NetPay =
      calculateTaxableIncome() -
      (calculateTaxAfterRelief() + caclulateNHIFFee());
  } else return (NetPay = calculateTaxableIncome() - caclulateNHIFFee());
  return NetPay;
};

// output to display
submit.addEventListener("click", () => {
  if (montlySalary() >= 0) {
    if (calculateNSSFFee() >= 0) {
      analyze.innerHTML = `<span id="call_message">Calculating...</span>`;
      submit.style.backgroundColor = "#6090ff";
      submit.style.color = "white";
      submit.style.border = "1px solid transparent";
      setTimeout(function calculating() {
        analyze.innerHTML = "";
        output.classList.remove("hide");
        scroller.classList.remove("hide");
        submit.style.backgroundColor = "transparent";
        submit.style.color = "#003c6e";
        submit.style.border = "1px solid #707070";
      }, 1500);
      if (periodState === true) {
        document.querySelector("#display").innerHTML = `
      <div id="row-1">
        <p>INCOME BEFORE PENSION DEDUCTION</p>
        <p>${montlySalary()}</p>
      </div>
      <div id="row-1">
        <p>DEDUCTIBLE NSSF PENSION CONTRIBUTION</p>
        <p>${calculateNSSFFee()}</p>
      </div>
      <div id="row-1">
        <p>INCOME AFTER PENSION DEDUCTIONS</p>
        <p>${calculateIncomeAfterPension()}</p>
      </div>
      <div id="row-1">
        <p>BENEFITS IN KIND</p>
        <p>${calculateBenefits()}</p>
      </div>
      <div id="row-1">
        <p>TAXABLE INCOME</p>
        <p>${calculateTaxableIncome()}</p>
      </div>
      <div id="row-1">
        <p>TAX ON TAXABLE INCOME</p>
        <p>${calculateTaxOnTaxableIncome()}</p>
      </div>
      <div id="row-1">
        <p>PERSONAL RELIEF</p>
        <p>${checkRelief()}</p>
      </div>
      <div id="row-1">
        <p>TAX NET OF RELIEF</p>
        <p>${calculateTaxAfterRelief()}</p>
      </div>
      <div id="row-1">
        <p>PAYEE</p>
        <p>${calculateTaxAfterRelief()}</p>
      </div>
      <div id="row-1">
        <p>CHARGABLE INCOME</p>
        <p>${calculateTaxableIncome()}</p>
      </div>
      <div id="row-1">
        <p>NHIF CONTRIBUTION</p>
        <p>${caclulateNHIFFee()}</p>
      </div>
      <div id="row-1">
        <p>NET PAY</p>
        <p>${calculateNetPay()}</p>
      </div>
      `;
      } else {
        document.querySelector("#display").innerHTML = `
        <div id="row-1">
          <p>INCOME BEFORE PENSION DEDUCTION</p>
          <p>${montlySalary() * 12}</p>
        </div>
        <div id="row-1">
          <p>DEDUCTIBLE NSSF PENSION CONTRIBUTION</p>
          <p>${calculateNSSFFee() * 12}</p>
        </div>
        <div id="row-1">
          <p>INCOME AFTER PENSION DEDUCTIONS</p>
          <p>${calculateIncomeAfterPension() * 12}</p>
        </div>
        <div id="row-1">
          <p>BENEFITS IN KIND</p>
          <p>${calculateBenefits() * 12}</p>
        </div>
        <div id="row-1">
          <p>TAXABLE INCOME</p>
          <p>${calculateTaxableIncome() * 12}</p>
        </div>
        <div id="row-1">
          <p>TAX ON TAXABLE INCOME</p>
          <p>${calculateTaxOnTaxableIncome() * 12}</p>
        </div>
        <div id="row-1">
          <p>PERSONAL RELIEF</p>
          <p>${checkRelief() * 12}</p>
        </div>
        <div id="row-1">
          <p>TAX NET OF RELIEF</p>
          <p>${calculateTaxAfterRelief() * 12}</p>
        </div>
        <div id="row-1">
          <p>PAYEE</p>
          <p>${calculateTaxAfterRelief() * 12}</p>
        </div>
        <div id="row-1">
          <p>CHARGABLE INCOME</p>
          <p>${calculateTaxableIncome() * 12}</p>
        </div>
        <div id="row-1">
          <p>NHIF CONTRIBUTION</p>
          <p>${caclulateNHIFFee() * 12}</p>
        </div>
        <div id="row-1">
          <p>NET PAY</p>
          <p>${calculateNetPay() * 12}</p>
        </div>
        `;
      }
    } else {
      return calculateNSSFFee();
    }
  }
});

let toggleState = false;
openView.addEventListener("click", () => {
  toggleState = !toggleState;
  if (toggleState) {
    document.querySelector("#display").style.transition = ".2s ease-in-out";
    document.querySelector("#display").style.display = "none";
    openView.querySelector("img").style.transition = ".25s ease-in-out";
    openView.querySelector("img").style.transform = "rotate(0deg)";
  } else {
    document.querySelector("#display").style.display = "block";
    openView.querySelector("img").style.transform = "rotate(180deg)";
  }
});
