/**
 * HorlSM - Cambodian Salary Tax & Payroll Calculator
 * Official General Department of Taxation (GDT) Progressive Tax Brackets for Resident Employees.
 */

const TAX_BRACKETS = [
  { min: 0, max: 1500000, rate: 0.00, deductConstant: 0 },
  { min: 1500000, max: 2000000, rate: 0.05, deductConstant: 75000 },
  { min: 2000000, max: 8500000, rate: 0.10, deductConstant: 175000 },
  { min: 8500000, max: 12500000, rate: 0.15, deductConstant: 600000 },
  { min: 12500000, max: Infinity, rate: 0.20, deductConstant: 1225000 }
];

const DEPENDENT_ALLOWANCE_KHR = 150000; // 150,000 KHR per dependent spouse/child

class TaxCalculator {
  /**
   * Calculates Cambodian Tax on Salary (ToS)
   * @param {number} grossSalaryKhr - Gross monthly salary in KHR
   * @param {boolean} hasSpouse - True if non-working spouse
   * @param {number} children - Number of dependent children
   * @returns {Object} Full breakdown of tax calculation
   */
  static calculate(grossSalaryKhr, hasSpouse = false, children = 0) {
    const gross = Math.max(0, Number(grossSalaryKhr) || 0);
    const spouseDeduction = hasSpouse ? DEPENDENT_ALLOWANCE_KHR : 0;
    const childrenDeduction = (Math.max(0, Number(children) || 0)) * DEPENDENT_ALLOWANCE_KHR;
    const totalDeduction = spouseDeduction + childrenDeduction;

    const taxableSalary = Math.max(0, gross - totalDeduction);
    let taxAmount = 0;
    let applicableRate = 0;

    if (taxableSalary > 1500000) {
      for (const bracket of TAX_BRACKETS) {
        if (taxableSalary > bracket.min && taxableSalary <= bracket.max) {
          applicableRate = bracket.rate;
          taxAmount = (taxableSalary * bracket.rate) - bracket.deductConstant;
          break;
        }
      }
    }

    taxAmount = Math.max(0, Math.round(taxAmount));
    const netSalary = gross - taxAmount;

    return {
      grossSalary: gross,
      spouseDeduction: spouseDeduction,
      childrenDeduction: childrenDeduction,
      totalDeduction: totalDeduction,
      taxableSalary: taxableSalary,
      taxRatePercent: applicableRate * 100,
      taxAmount: taxAmount,
      netSalary: netSalary
    };
  }

  /**
   * Formats Cambodian Riel currency string
   */
  static formatKhr(amount) {
    return (Math.round(amount) || 0).toLocaleString('km-KH') + ' ៛';
  }

  /**
   * Formats USD currency string
   */
  static formatUsd(amount) {
    return '$' + (Number(amount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  /**
   * Converts USD to KHR
   */
  static usdToKhr(usdAmount, exchangeRate = 4100) {
    return Math.round((Number(usdAmount) || 0) * exchangeRate);
  }

  /**
   * Converts KHR to USD
   */
  static khrToUsd(khrAmount, exchangeRate = 4100) {
    return (Number(khrAmount) || 0) / exchangeRate;
  }
}

window.TaxCalculator = TaxCalculator;
