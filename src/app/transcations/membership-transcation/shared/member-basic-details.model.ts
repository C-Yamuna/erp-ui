export class MemberBasicDetails {

  id: any;

  memberTypeId: any;

  memberTypeName:any;

  memberClassType:any;

  surname: any;

  name: any;

  dob: any;

  age: any;

  genderId: any;

  martialId: any;

  relationId: any;

  relativeName: any;

  qualificationId: any;

  occupationId: any;

  aadharNumber: any;

  panNumber: any;

  mobileNumber: any;

  emailId: any;

  casteId: any;

  communityId: any;

  mcrNumber: any;

  admissionDate: any;

  admissionDateVal :any;

  admissionNumber: any;

  admissionFee: any;

  status: any;

  memStartDate: any;

  isMemClosed: any;

  closureComments: any;

  pacsId: any;

  pacsCode: any;

  memClosingDate: any;

  shareCapital: any;

  branchId: any;

  surnameLocalLang: any;

  nameLocalLang: any;

  isMinor: any;

  totalLandInUnits: any;

  totalLandInSubUnits: any;

  dependentsCount: any;

  assetCount: any;

  isNominee: any;

  memberName: any;

  genderName: any;

  maritalStatusName: any;

  relationTypeName: any;

  occupationName: any;

  qualificationName: any;

  communityName: any;

  casteName: any;

  memberShipLandDetailsDTOList: any;

  memberNomineeGuardianDetailsDTOList: any;

  memberShipAssertDetailsDTOList: any;

  memberShipCommunicationDetailsDTOList: any;

  memberShipFamilyDetailsDTOList: any;

  memberShipFeeDetailsDTOList: any;

  memberShipKycDetailsDTOList: any;

  memberShipNomineeDetailsDTOList: any;

  memberShipGuadianDetailsDTOList: any;

  statusName: any;

  approvedComments: any;

  approvedBy: any;

  approvedOn: any;

  subProductId: any;

  memStatusChangedDate: any;

  subProductName: any;

  temAdmDate:any;

  dateOfBirth:any;

  memberClassTypeName:any;
  
  memDobVal:any;

   mcrDocumentCopy:any;
    
   photoCopyPath:any;
	
	signatureCopyPath:any;

  multipartFileListForPhotoCopy:any;

  multipartFileListForsignatureCopyPath:any;

  filesDTOList:any;

  multipartFileListForMCRCopyPath:any;

  signedCopyPath:any;

  multipartFileListsignedCopyPath:any;

  remarks:any;

  memberShipCommunicationDetailsDTO: any;

  isKycApproved:any;

  requiredDocumentDetailsDTOList:any;

   memberShipLandDetailsDTO:any;

   isStaff:any;

   memClosingDateVal:any;

   closureSignedCopyPath:any;

   closureSignedCopyPathList:any;

   societyAdmissionNumber:any;

   resolutionDate:any;

   resolutionDateVal:any;

  
}

export class MemberNomineeDetails {

  id: any;

  memberShipId: any;

  relationTypeId: any;

  nomineeName: any;

  nomineeAge: any;

  nomineeDob: any;

  nomineeDobVal:any;

  nomineeMobileNumber: any;

  nomineeAadharNumber: any;

  nomineeEmailId: any;

  nomineeAdress: any;

  nomineeFilePath: any;

  isNomineeMinor: any;

  pacsId: any;

  pacsCode: any;

  branchId: any;

  relationTypeName: any;

  filesDTOList:any;

  subProductIdany: any;

  subProductNameany: any;

  remarks:any;

  flagForNomineeTypeValue: any;

  nomineeType:any;

  multipartFileList:any;
   
  status:any;
    
   statusName:any;
  
   admissionNumber:any;
  
  nomineeTypeName:any;

  filesDTO:any

  memberGuardianDetailsModel:any;

  memberAge:any;


}

export class MemberGuardianDetailsModel {
  id: any;

  memberId: any;

  memberTypeId: any;

  guardianName: any;

  relationshipTypeId: any;

  guardianAge: any;

  guardianDob: any;

  guardianDobVal:any;

  guardianMobileNumber: any;

  guardianAadharNumber: any;

  guardianEmailId: any;

  guardianAddress: any;

  status: any;

  pacsId: any;

  pacsCode: any;

  branchId: any;

  relationshipTypeName: any;

  memberTypeName:any;

  subProductId: any;

  subProductName: any;

  guardianType:any;

  statusName:any;

  filesDTO:any;

  kycFilePath :any;

  admissionNumber:any;

  guardianTypeName :any;

  uploadFilePath:any;

  multipartsFileList:any;

  remarks:any;


}
export class MemberLandDetailsModel {
  id:any;
 
  pacsId:any;
 
  pacssCode:any;
 
  branchId:any;
 
  memberId:any;
 
  admissionNumber:any;
 
  districtId:any;
 
  districtCode:any;
 
  subDistrictId:any;
 
  subDistrictCode:any;
 
  villageId:any;
 
  villageCode:any;
 
  passbookNumber:any;
 
  capturedOn:any;
 
  capturedBy:any;
 
  isVerifiedOn:any;
 
  isVerificationBy:any;

  ieVerifiedOn:any;
 
  ieVerificationBy:any;
 
  ceoVerifiedOn:any;
 
  ceoVerificationBy:any;
 
  custLandSurveyDetails:any;
 
  stateName:any;
 
  districtName:any;
 
  subDistrictName:any;
 
  villageName:any;
  
  memName:any;

  memVillageName:any;

  admissionDate:any;

  fatherOrSpousename:any;

  concatinatedAdmissionNumber:any;

  stateId:any;

  status:any;

  statusName:any;

  totalLandInAcres:any;

  totalCultivableLandInAcres :any;
  
  totalUnderCultivationLandInAcres:any;

  approvedComments:any;

  fields:any;

  totalMemberLandDetailsCont:any;

  uploadFilePath:any;
  
  filesDTO:any;

  preMemAdmissionNumber: any;

  preMemName: any;

  preMemAccountNumber: any;

  preMemAdmissionDate:any;

  admissionDateVal?:any;

  activeStatus?:any;
  
  landAnalyzerList?:any

  memType:any;

}
export class MembershipFamilyDetailsModel {
  id: any;

  membershipId: any;

  relationTypeId: any;

  name: any;

  dob: any;

  memDobVal:any;

  age: any;

  aadharNumber: any;

  mobileNumber: any;

  emailId: any;

  docFilePath: any;

  qualificationId: any;

  surname: any;

  pacsId: any;

  pacsCode: any;

  branchId: any;

  occupationId: any;

  qualificationName: any;

  relationTypeName: any;

  occupationName: any;

  filesDTO:any;

  multipleFilesList:any;
}

export class MemberCommunicationDeatilsModel {
  id: any;

  memberShipId: any;

  stateId: any;

  districtId: any;

  villageId: any;

  subDistrictId: any;

  address1: any;

  address2: any;
;
  addressType:any

  pinCode: any;

  isSameAddress:boolean = false;

  pacsId: any;

  pacsCode: any;

  branchId: any;

  stateName: any;

  districtName: any;

  subDistrictName: any;

  villageName: any;

  permanentStateId: any;

    permanentDistrictId: any;

   permanentSubDistrictId: any;

    permanentVillageId: any;

     permanentAddress1: any;

     permanentAddress2: any;

     permanentPinCode: any;
    
     permanentStateName: any;
    
     permanentDistrictName: any;
    
     permanentSubDistrictName: any;
    
    permanentVillageName: any;

    divisionId:any;

    blockId:any;
 
    divisionName:any;
 
    blockName:any;

    permanentDivisionId:any;

	  permanentBlockId:any;

	  permanentDivisionName:any;

	  permanentBlockName:any;
 
}
export class MemberKycDetailsModel {
  id: any;

  kycDocumentTypeId: any;

  documentNumber: any;

  nameAsPerDocument: any;

  kycFilePath: any;

  membershipId: any;

  isDocVerified: any;

  pacsId: any;

  pacsCode: any;

  branchId: any;

  kycDocumentTypeName: any;

  filesDTO:any

  multipleFilesList:any
  
  status:any;

  admissionNumber:any
}
export class MembershipAssetsDetailsModel{
    id: any;

    membershipId: any;

    assetTypeId: any;

   assetName: any;

   registeredNumber: any;

    registeredDate: any;

    registeredDateVal: any;


    initialValue: any;

    currentValue: any;

    depreciationPercentage: any;

   assetFilePath: any;

    pacsId: any;

   pacsCode: any;

    branchId: any;
  
   assetTypeName: any;
  
  filesDTO: any;

  multipartFileList:any;

}
export class MemberNomoineeGuardianDetailsModel {
  id: any;

  memberId: any;

  memberTypeId: any;

  memNomineeId: any;

  guardianName: any;

  relationshipTypeId: any;

 guardianAge: any;

  guardianDob: any;

  guardianDobVal: any;

  guardianMobileNumber: any;

  guardianAadharNumber: any;

  guardianEmailId: any;

  guardianAddress: any;

 status: any;

  pacsId: any;

  pacsCode: any;

  branchId: any;

  nomineeName: any;

  memberTypeName: any;

  relationshipTypeName: any;

  subProductId: any;

  subProductName: any;

  statusName: any;

  remarks:any;
  

}
export class CustomerLandSurvyDetailsModel {
  id: any;

  memberId: any;

  pacsId: any;

  pacsCode: any;

  landDetailsId: any;

  surveyNumber: any;

  titleDeedNumber: any;

  totalLand: any;

  cultivableLand: any;

  underCultivationLand: any;

  soilType: any;

  landType: any;

  irrigationType: any;

  landOwnership: any;

  eastBoundary: any;

  westBoundary: any;

  southBoundary: any;

  northBoundary: any;

  acerValue: any;

  declaredLand: any;

  declaredLandValue: any;

  cropId: any;

  societyName: any;
  soilTypeName: any;

  landTypeName: any;

  irrigationTypeName: any;

  cropName: any;

  landOwnershipName: any;

  rowId: any;

  status: any;

  statusName: any;

  passbookNumber: any;

  villageName: any;


  totalLandInSubUnits: any;

cultivableLandInSubUnits: any;

underCultivationLandInSubUnits: any;

caliculatedTotalLand: any;

caliculatedCultivableLand: any;

caliculatedUnderCultivationLand: any;

  villageId: any;

  coveredVillagename : any;

  masterVillageId:any;

  khataNumber:any;

  waterSourceId:any;

}