export class CiGoldMortgageLoan {

    id : any;

    ciLoanApplicationId : any;

    admissionNo : any;

    itemName : any;

    netWeight : any;

    grossWeight : any;

    value : any;

    remarks : any;

    carats : any;
    
    tatus : any;
    
    statusName : any;

    collateralType:any;

    //latest fileds from DCT 
    ornamentDescription:any;
    ornamentsCount:any;
    ornamentQualityInKdm:any;
    ornamentGrossWeightInGm:any;
    ornamentNetWeightInGm:any;
    valuePerGramInRs:any;
    ornamentNetValueInRs:any;

}
export class CiLandMortgageLoan {

    id : any;

    ciLoanApplicationId : any;

    admissionNo : any;

    landUnits : any;

    landSubUnits : any;

    value : any;

    remarks : any;

    passbookNumber : any;

    surveyNo : any;

    documentPath : any;

    declaredLandUnits : any;

    declaredLandSubUnits : any;

    landType : any;
    
    tatus : any;
    
    statusName : any;

    collateralType:any;

    landTypeName:any;


    // latest 
    landOwnership:any;
     villageId:any;
     khataNumber:any;
     surveyNumber:any;
     totalLandInSubUnits:any;
     mortgageLandValuePerUnit:any;
     totalLandInUnits:any;
     totalMortgageLandValue:any;
     mortgageLandInUnits:any;
     mortgageLandInSubUnits:any;
     mortgageDeedDate:any
     mortgageDeedDateVal:any;
     mortgageDeedNumber:any;
     landValuePerUnit:any;
     totalLandValue:any;
    


}
export class CiBondsMortgageLoan {

    id : any;

    ciLoanApplicationId : any;

    admissionNo : any;

    bondNumber : any;

    faceValue : any;

    surrenderValue : any;

    bondPath : any;

    pledgedFilePath : any;

    maturityDate : any;
    
    tatus : any;
    
    statusName : any;

    collateralType:any;

    // latest
    bondType:any;
    bondIssuedDate:any;
    bondIssuedDateVal:any;
    bondIssuedBy:any;
    bondMaturityDateVal:any;
    bondMaturityDate:any;
    bondMaturityValueInRs:any;
    bondPrincipleAmount:any;
   

}
export class CiVehicleMortgageLoan {

    id : any;

    ciLoanApplicationId : any;

    admissionNo : any;

    vechileName : any;

    rcNumber : any;

    rcFilePath : any;

    value : any;

    brand : any;

    remarks : any;
    
    tatus : any;
    
    statusName : any;

    collateralType:any;

    // letest 
    vehicleMakerOrBrand:any;
    vehicleModel:any;
    vehicleRegNumber:any;
    vehicleCost:any;
    hypothecation:any;
    insuranceNumber:any;
    insuranceAmount:any;
    vehicleStatus:any;

}
export class CiStorageMortgageLoan {

    id : any;

    ciLoanApplicationId : any;

    admissionNo : any;

    name : any;

    quantity : any;

    totalWeight : any;

    netWeight : any;

    value : any;
    
    tatus : any;
    
    statusName : any;

    collateralType:any;

    // lateset
    netValueInRs:any;
    perUnitCostInRs:any;
    numberOfUnitsStored:any;
    dateOfIssueVal:any;
    dateOfIssue:any;
    nwrStorageReceiptNumber:any;
    commodity:any;

}
export class CiOthersMortgageLoan {

    id : any;

	pacsId : any;

	branchId : any;

	ciProductId : any;

	ciLoanApplicationId : any;

	bankName : any;

	acNo : any;

	dueDate : any;

	loanAmount : any;

	dueAmount : any;

	ciProductName : any;
	
	applicationPath : any;
	
    filesDTO : any;
    
    tatus : any;
    
    statusName : any;

    collateralType:any;

    //latest
    name : any;
    noOfUnits: any;
    value: any;
    remarks: any;
}

export class CiPropertyMortgageLoan {

    id : any;

	pacsId : any;

	branchId : any;

	ciProductId : any;

	ciLoanApplicationId : any;

	bankName : any;

	acNo : any;

	site : any;
    location : any;
    bondIssuedDateVal : any;
    squareYards : any;
    propertySurveyNumber : any;
    valueOfProperty : any;
    extentOfProperty : any;
    nameOfProperty : any;
    
    statusName : any;

    collateralType:any;
}