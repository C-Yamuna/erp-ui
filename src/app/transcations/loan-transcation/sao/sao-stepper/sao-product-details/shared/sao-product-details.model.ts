export class SaoProductDetails {
    id: any;

    name: any;

    description: any;

    status: any;

    gestationPeriod: any;

    interestCalculationType: any;

    effectiveStartDate: any;

    endDate: any;

    eligibleMInAmount: any;

    eligibleMaxAmount: any;

    minLoanPeriod: any;

    maxLoanPeriod: any;

    demandAlertDays: any;

    defaulterAlertDays: any;

    maxLoanAccountsAllowed: any;

    loanLinkedshareCapitalApplicable: any;

    noOfGuarantorsRequired: any;

    isInsuranceAppicable: any;

    minDaysForRenewel: any;

    pacsId: any;

    pacsCode: any;

    branchId: any;

    isNpaExceptional: any;

    interestRateType: any;
  
    statusName: any;
  
    interestCalculationTypeName: any;
  
    nomineeRequired: any;
  
    saoProductId: any;

    // repaymentFrequency: any;

    interestPostingFrequency: any;

    interestPostingFrequencyName: any;

    saoInterestPolicyConfigDto: any;

    saoProdPurPoseConfgList: any;

    saoInterestPolicyConfigDtoList:any;

    purposeName: any;

    purposeId: any;

}
export class SaoInterestPolicyConfigModel{
    id: any;

    saoProductId: any;

    roi: any;

    penalInterest: any;

    iodApplicable: any;

    iod: any;

    womenConcession: any;

    employeeConcession: any;

    seniorCitizenConcession: any;

    effectiveStartDate: any;

    endDate: any;

    status: any;
  
    statusName: any;
  
    saoProductName: any;


}
export class SaoProductChargesConfigModel{
    id: any;

    saoProductId: any;

    chargesId: any;

    applicableDuring: any;

    minSlabAmount: any;

    maxSlabAmount: any;

    chargesType: any;

    collectionFrequency: any;

    charges: any;

    minCharges: any;

    maxChrges: any;

    effectiveStartDate: any;

    endDate: any;

    status: any;

    cgst: any;

    sgst: any;

    igst: any;
  
    chargesTypeName: any;
  
    saoProductName: any;
  
    statusName: any;

    chargesName: any;

    totalAmount: any;
}
export class SaoLoanDisbursementScheduleModel{
    id: any;

    saoLoanApplicationId: any;

    disbursementNumber: any;

    type: any;

    disbursementLimit: any;

    minDaysForDisbursement: any;

    remarks: any;
  
    disbursementOrder: any;
  
    status: any;
  
    statusName: any;
  
    amount: any;
  
    typeName: any;

    visitNumber: any;
    
    isRequired: any;
    
    disbursementPercentage: any;
    
    tenure: any;
    
    tenureType: any;
    
    tenureTypeName: any;
}
