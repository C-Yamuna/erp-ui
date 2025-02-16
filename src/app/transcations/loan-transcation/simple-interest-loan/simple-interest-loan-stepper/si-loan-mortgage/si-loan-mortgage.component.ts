import { SiGoldLoanMortgage, SiLandLoanMortgage, SiBondLoanMortgage, SiVehicleLoanMortgage, SiOtherLoanMortgage, SiStorageLoanMortgage, SiPropertyMortgageLoan } from './../../../shared/si-loans/si-loan-mortgage.model';
import { SiLoanMortagageDetailsService } from './../../../shared/si-loans/si-loan-mortagage-details.service';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MembershipBasicRequiredDetails, MemberGroupDetailsModel, MembershipInstitutionDetailsModel } from 'src/app/transcations/savings-bank-transcation/savings-bank-account-creation-stepper/membership-basic-required-details/shared/membership-basic-required-details';
import { SiLoanProductDefinition } from '../../../shared/si-loans/si-loan-product-definition.model';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Table } from 'primeng/table';
import { SiLoanApplicationService } from '../../../shared/si-loans/si-loan-application.service';
import { SiLoanApplication } from '../../../shared/si-loans/si-loan-application.model';
import { DatePipe } from '@angular/common';
import { SiProductDefinitionService } from '../../../shared/si-loans/si-product-definition.service';
import { VillagesService } from 'src/app/configurations/common-config/villages/shared/villages.service';
import { CollateralTypes, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { SiLoanVehicleMortgageDetailsService } from '../../../shared/si-loans/si-loan-vehicle-mortgage-details.service';
import { SiOtherMortgageDetailsService } from '../../../shared/si-loans/si-other-mortgage-details.service';

@Component({
  selector: 'app-si-loan-mortgage',
  templateUrl: './si-loan-mortgage.component.html',
  styleUrls: ['./si-loan-mortgage.component.css']
})
export class SiLoanMortgageComponent {
  selectedCollateralType: string = ''; // Stores the selected collateral type


  siGoldMortgageForm: FormGroup;
    siLandMortgageForm: FormGroup;
    siBondMortgageForm: FormGroup;
    siVehicleMortgageForm: FormGroup;
    siStorageMortgageForm: FormGroup;
    siOtherMortgageForm: FormGroup;
    propertyDetailsForm: FormGroup;
    suretyForm: FormGroup;
    landSurveyDuplicateDisable: boolean = false;
    displayDialog: boolean = false;
    selectCollateralType: any;
    collateraltypeOptionsList: any[] = [];
    deleteId: any;
    showGoldform: boolean = false;
    showLandform: boolean = false;
    showBondform: boolean = false;
    showVehicleform: boolean = false;
    showStorageform: boolean = false;
    showOtherform: boolean = false;
    accountOpeningDateVal: any;
    minBalence: any;
    accountType: any;
    productName: any;
    carratsList: any[] = [];
    gender: any[] | undefined;
    maritalstatus: any[] | undefined;
    checked: boolean = false;
    responseModel!: Responsemodel;
    productsList: any[] = [];
    operationTypesList: any[] = [];
    schemeTypesList: any[] = [];
    orgnizationSetting: any;
    msgs: any[] = [];
    columns: any[] = [];
    insuranceVendorDetailsList: any[] = [];
    occupationTypesList: any[] = [];
    gendersList: any[] = [];
    relationshipTypesList: any[] = [];
    isMemberCreation: boolean = false;
    surveyId: any;

  
  siPropertyMortgageLoanModel: SiPropertyMortgageLoan = new SiPropertyMortgageLoan();
  membershipBasicRequiredDetails: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  siLoanProductDefinitionModel: SiLoanProductDefinition = new SiLoanProductDefinition();
  siGoldLoanMortgageModel: SiGoldLoanMortgage = new SiGoldLoanMortgage();
  siLandLoanMortgageModel: SiLandLoanMortgage = new SiLandLoanMortgage();
  siBondLoanMortgageModel: SiBondLoanMortgage = new SiBondLoanMortgage();
  siVehicleLoanMortgageModel: SiVehicleLoanMortgage = new SiVehicleLoanMortgage();
  siStorageLoanMortgageModel: SiStorageLoanMortgage = new SiStorageLoanMortgage();
  siOtherLoanMortgageModel: SiOtherLoanMortgage = new SiOtherLoanMortgage();
  siLoanApplicationModel: SiLoanApplication = new SiLoanApplication();
   
  
    memberTypeName: any;
    siLoanApplicationId: any;
    isEdit: boolean = false;
    admissionNumber: any;
  
    ciGoldMortgageLoanModelList: any[] = [];
    ciLandMortgageLoanModelList: any[] = [];
    ciBondsMortgageLoanModelList: any[] = [];
    ciVehicleMortgageLoanModelList: any[] = [];
    ciStorageMortgageLoanModelList: any[] = [];
    ciOthersMortgageLoanModelList: any[] = [];
  
    institutionPromoter: any[] = [];
    visible: boolean = false;
    isFormValid: Boolean = false;
  
    
    @ViewChild('gold', { static: false }) private gold!: Table;
    @ViewChild('land', { static: false }) private land!: Table;
    @ViewChild('bond', { static: false }) private bond!: Table;
    @ViewChild('vehicle', { static: false }) private vehicle!: Table;
    @ViewChild('storage', { static: false }) private storage!: Table;
    @ViewChild('property', { static: false }) private property!: Table;
    @ViewChild('surety', { static: false }) private surety!: Table;
    @ViewChild('other', { static: false }) private other!: Table;
  
    addButton: boolean = false;
    newRow: any;
    EditDeleteDisable: boolean = false;
  
    goldLoanMortgageColumns: any[] = [];
    landLoanMortgageColumns: any[] = [];
    bondLoanMortgageColumns: any[] = [];
    vehicleLoanMortgageColumns: any[] = [];
    storageLoanMortgageColumns: any[] = [];
    otherLoanMortgageColumns: any[] = [];
    propertyColumns: any[] = [];
    suretyOrGuarantorColumns: any[] = [];
    staffColumns: any[] = [];
    agreementColumns: any[] = [];
  
    isSameCollateral: Boolean = false;
  
    collateralType: any;
    landTypesList: any[] = [];
  
    addButtonService: boolean = false;
    siGoldLoanMortgageList: any[] = [];
    siLandLoanMortgageList: any[] = [];
    siBondLoanMortgageList: any[] = [];
    siVehicleLoanMortgageList: any[] = [];
    siStorageLoanMortgageList: any[] = [];
    siOtherLoanMortgageList: any[] = [];
    siPropertyMortgageList: any[] = [];
    siSuretyOrGuarantoMortgageList: any[] = [];
    bondTypesList:any[]=[];
  
    editDeleteDisable: boolean = false;
    landTypeName: any;
  
    ciLoanPropertyList:any[]=[];
    ciSurityMortgageList:any[]=[];
    ciStaffList:any[]=[];
    ciAgeementList:any[]=[];
  
    villagesList:any[]=[];
    landOwnershipTypesList:any[]=[];
  
    vehicleStatusList:any[]=[];
  
    showciVehicleMortgageForm:boolean = false;
    showpropertyForm:boolean = false;
    showSuretyForm :boolean = false;
  
    addPropertyButton:boolean = false;
  
    aClassMemList:any[]=[];
  
    memName:any;
  
    addSuretyButton:boolean = false;
  
  
    //pop ups
    goldMortgagePopUp:boolean = false;
    landMortgagePopUp:boolean = false;
    bondMortgagePopUp:boolean = false;
    storagePopUp:boolean = false;
    propertyPopUp : boolean = false;
    otherMortgagePopUp:boolean = false;
  
    operationTypeName: any;
    siProductName: any;
    accountNumber: any;
    requestedAmount: any;
  
  
    constructor(private formBuilder: FormBuilder,
      private commonFunctionsService: CommonFunctionsService,private siOtherMortgageDetailsService:SiOtherMortgageDetailsService,
      private encryptDecryptService: EncryptDecryptService, private commonComponent: CommonComponent,
      private activateRoute: ActivatedRoute,private siLoanVehicleMortgageDetailsService:SiLoanVehicleMortgageDetailsService,
      private siLoanMortagageDetailsService:SiLoanMortagageDetailsService,
      private siLoanApplicationService: SiLoanApplicationService,private datePipe: DatePipe ,private siProductDefinitionService: SiProductDefinitionService, private villageService : VillagesService
    ) {
  
      this.siGoldMortgageForm = this.formBuilder.group({
        'ornamentDescription': new FormControl('', [Validators.required]),
        'ornamentsCount': new FormControl('', Validators.compose([Validators.required])),
        'ornamentQualityInKdm': new FormControl('',  Validators.compose([Validators.required])),
        'ornamentGrossWeightInGm': new FormControl('',  Validators.compose([Validators.required])),
        'ornamentNetWeightInGm': new FormControl('',Validators.compose([Validators.required])),
        'valuePerGramInRs': new FormControl('',  Validators.compose([Validators.required])),
        'ornamentNetValueInRs': new FormControl('', Validators.compose([Validators.required])),
      })
  
      this.siLandMortgageForm = this.formBuilder.group({
       'passbookNumber': new FormControl('', [Validators.required]),
        'khataNumber': new FormControl('', [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
        'surveyNumber': new FormControl('', [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
        'totalLandInUnits':new FormControl(Validators.compose([Validators.required]), [Validators.maxLength(5) ]),
        'totalLandInSubUnits': new FormControl([Validators.required], [Validators.maxLength(5)]),
        'landValuePerUnit': new FormControl(Validators.compose([Validators.required]), [Validators.minLength(1), Validators.maxLength(13) ]),   
        'totalLandValue': new FormControl(Validators.compose([Validators.required]), [ Validators.minLength(1), Validators.maxLength(13) ]),
        'mortgageLandInUnits': new FormControl(Validators.compose([Validators.required]), [Validators.maxLength(5)]),
        'mortgageLandInSubUnits': new FormControl( Validators.compose([Validators.required]), [Validators.maxLength(5)]),
        'mortgageLandValuePerUnit': new FormControl(Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_DECIMALS_UPTO_TWO_PLACES),  Validators.minLength(1), Validators.maxLength(13)]),
        'totalMortgageLandValue': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_DECIMALS_UPTO_TWO_PLACES),  Validators.minLength(1), Validators.maxLength(13)]),
        'mortgageDeedNumber': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
        'mortgageDeedDate': new FormControl('', [Validators.required]),
        'ownershipType': new FormControl('', [Validators.required]),
        'village': new FormControl('', [Validators.required])
      })
  
      this.siBondMortgageForm = this.formBuilder.group({
        'bondType': new FormControl('', [Validators.required]),
        'bondNumber': new FormControl(Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC), ]),
        'bondIssuedDate': new FormControl('', [Validators.required]),
        'bondIssuedBy': new FormControl(Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC), ]),
        'bondMaturityDate': new FormControl('', [Validators.required]),
        'bondMaturityValueInRs': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_DECIMALS_UPTO_TWO_PLACES)]),
        'bondPrincipleAmount': new FormControl('', [Validators.required]),
      })
  
      this.siVehicleMortgageForm = this.formBuilder.group({
        'vehicleMakerOrBrand': new FormControl(Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
        'vehicleModel': new FormControl(Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
        'vehicleRegNumber': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
        'vehicleCost': new FormControl(Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_DECIMALS_UPTO_TWO_PLACES)]),
        'insuranceNumber': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
        'insuranceAmount': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_DECIMALS_UPTO_TWO_PLACES)]),
        'vehicleStatus': new FormControl('', [Validators.required]),
        'hypothecation': new FormControl('', [Validators.required]),
      })
  
      this.siStorageMortgageForm = this.formBuilder.group({
      'commodity': new FormControl(Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
        'nwrStorageReceiptNumber': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
        'dateOfIssue': new FormControl('', [Validators.required]),
        'numberOfUnitsStored': new FormControl('', [Validators.required]),//present on hold
        'perUnitCostInRs': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_DECIMALS_UPTO_TWO_PLACES)]),
        'netValueInRs': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_DECIMALS_UPTO_TWO_PLACES)]),
      })
  
      this.siOtherMortgageForm = this.formBuilder.group({
        name: new FormControl('', Validators.required),
        noOfUnits: new FormControl('', Validators.required),
        value: new FormControl('', Validators.required),
        remarks: new FormControl('')
      })
  
      this.propertyDetailsForm = this.formBuilder.group({
        'site': new FormControl('', [Validators.required]),
        'location': new FormControl('', [Validators.required]),
        'squareYards': new FormControl('', [Validators.required]),
        'propertySurveyNumber': new FormControl('', [Validators.required]),
        'valueOfProperty': new FormControl(Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_DECIMALS_UPTO_TWO_PLACES), Validators.minLength(1), Validators.maxLength(13)]),
        'nameOfProperty': new FormControl('', [Validators.required]),
        'extentOfProperty': new FormControl('', [Validators.required]),
        
      });
  
      this.suretyForm = this.formBuilder.group({
        'admissionNumber': new FormControl('', [Validators.required]),
        'memName': new FormControl({ value: "", disabled: true }),
        'admissionDate': new FormControl({ value: "", disabled: true }),
        'memMobile': new FormControl({ value: "", disabled: true }),
        'villageId': new FormControl({ value: "", disabled: true }),
      });
  
    }
  
    ngOnInit() {
      this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');
      this.orgnizationSetting = this.commonComponent.orgnizationSettings()
      this.getAllLandTypes();
      this.getAllVaillages();
      this.getAllLandOwnerShipTypes();
      this.getAllBondTypes();
  
      this.vehicleStatusList = [
        { label: 'Used', value: 'Used' },
        { label: 'Un-Used', value: 'Used' },
      ];
      this.collateraltypeOptionsList = [
        { label: 'Gold', value: 1 },
        { label: 'Land', value: 2 },
        { label: 'Bond', value: 3 },
        { label: 'Vehicle', value: 4 },
        { label: 'Storage', value: 5 },
        { label: 'Property', value: 6 },
        { label: 'Other', value: 7 }
        // { label: 'Surety /Guarantor', value: 8 },
        // { label: 'Staff', value: 9 },
        // { label: 'Agreement', value: 10 },
        
      ];
  
      //gold
      this.goldLoanMortgageColumns = [
        { field: 'itemName', header: '*Ornament Description	' },
        { field: 'itemName', header: '*Ornaments Count	' },
        { field: 'itemName', header: '*Ornament Quality In Kdm	' },
        { field: 'netWeight', header: '*Ornament Net Weight In Gm	' },
        { field: 'grossWeight', header: '*Ornament Gross Weight In Gm	' },
        { field: 'value', header: '*Value Per Gram	' },
        { field: 'itemName', header: '*Ornament Net Value	' },
        { field: 'remarks', header: 'REMARKS' },
        { field: 'Action', header: 'ACTION' },
      ];
       //land
      this.landLoanMortgageColumns = [
        { field: 'villageName', header: 'Village' },
        { field: 'passbookNumber', header: 'Passbook No' },
        { field: 'khataNumber', header: 'Khata Book No' },
        { field: 'surveyNumber', header: 'Survey No.' },
        { field: 'totalLandInUnits', header: 'Total Land In Units' },
        { field: 'totalLandInSubUnits', header: 'Total Land In Sub Units' },
        { field: 'landValuePerUnit', header: 'Land Value Per Unit' },
        { field: 'totalLandValue', header: ' Total Land Value' },
        { field: 'mortgageLandInUnits', header: 'Mortgage Land In Units' },
        { field: 'mortgageLandInSubUnits', header: 'Mortgage Land In SubUnits' },
        { field: 'mortgageLandValuePerUnit', header: 'Mortgage Land Value Per Unit' },
        { field: 'totalMortgageLandValue', header: 'Total Mortgage Land Value' },
        { field: 'mortgageDeedNumber', header: ' Mortgage Deed Number' },
        { field: 'mortgageDeedDateVal', header: 'Mortgage Deed Date' },
        { field: 'landOwnershipName', header: 'Land Ownership' },
      ];
      //Bond
      this.bondLoanMortgageColumns = [
        { field: 'bondType', header: '*Bond Types	' },
        { field: 'bondNumber', header: '*Bond Number	' },
        { field: 'bondIssuedDate', header: '*Bond Issued Date' },
        { field: 'bondIssuesBy', header: '*Bond Issued By	' },
        { field: 'bondMeturedDate', header: '*Bond Maturity Date	' },
        { field: 'bodnMeturityValue', header: ' *Bond Maturity Value		' },
        { field: 'bondPrincipalAmount', header: '*Bond Principal Amount	' },
        { field: 'Action', header: 'ACTION' },
      ];
  
      //vehicle
      //vehicla status master 
      //used unused
      this.vehicleLoanMortgageColumns = [
        { field: 'itemName', header: '* Vehicle Maker Or Brand' },
        { field: 'itemName', header: '* Vehicle Model' },
        { field: 'itemName', header: '* * Vehicle RegNumber' },
        { field: 'itemName', header: '* * Vehicle Cost' },
        { field: 'itemName', header: ' * * Hypothecation' },
        { field: 'itemName', header: '* * Insurance Number' },
        { field: 'itemName', header: '* * Sum Insured (₹)' },
        { field: 'itemName', header: ' * * Vehicle Status' },
        { field: 'Action', header: 'ACTION' },
      ];
  
      //storage
      this.storageLoanMortgageColumns = [
        { field: 'Commodity', header: 'Commodity' },
        { field: 'NWR Storage Receipt Number', header: 'NWR Storage Receipt Number' },
        { field: 'dateOfIssue', header: 'Date Of Issue' },
        { field: 'Number Of Units Stored', header: 'Number Of Units Stored' },
        { field: 'Per Unit Cost', header: 'Per Unit Cost' },
        { field: 'Net Value', header: 'Net Value' },
        { field: 'Action', header: 'ACTION' },
      ];
  
      //other
      this.otherLoanMortgageColumns = [
        { field: 'itemName', header: 'ITEM NAME' },
        { field: 'netWeight', header: 'NET WEIGHT IN GRAMS' },
        { field: 'grossWeight', header: 'GROSS WEIGHT IN GRAMS' },
        { field: 'value', header: 'VALUE' },
        { field: 'remarks', header: 'REMARKS' },
        { field: 'Action', header: 'ACTION' },
      ];
  
      //property
      this.propertyColumns = [
        { field: 'itemName', header: '*Site Name	' },
        { field: 'itemName', header: '*Location	' },
        { field: 'itemName', header: '*Square Yards	' },
        { field: 'itemName', header: '*Survey Number	' },
        { field: 'itemName', header: '*Value Of Property	' },
        { field: 'itemName', header: ' *Name Of Property	' },
        { field: 'itemName', header: ' *Extent Of Property	' },
        { field: 'Action', header: 'ACTION' },
      ];
  
      this.propertyColumns = [
        { field: 'itemName', header: '*Site Name	' },
        { field: 'itemName', header: '*Location	' },
        { field: 'itemName', header: '*Square Yards	' },
        { field: 'itemName', header: '*Survey Number	' },
        { field: 'itemName', header: '*Value Of Property	' },
        { field: 'itemName', header: ' *Name Of Property	' },
        { field: 'itemName', header: ' *Extent Of Property	' },
        { field: 'Action', header: 'ACTION' },
      ];
  
      //surety
      this.suretyOrGuarantorColumns = [
        { field: 'itemName', header: '*Admission No.	' },
        { field: 'itemName', header: ' *Member Name	' },
        { field: 'itemName', header: ' *Admission Date	' },
        { field: 'itemName', header: '*Mobile Number	' },
        { field: 'itemName', header: '*Village	' },
        { field: 'Action', header: 'ACTION' },
      ];
  
      //staffe no need to add 
      this.staffColumns = [
       
      ];
  
      //ageement also no collateral
      this.agreementColumns = [
       
      ];
      this.activateRoute.queryParams.subscribe(params => {
        if (params['id'] != undefined) {
          let queryParams = this.encryptDecryptService.decrypt(params['id']);
          this.siLoanApplicationId = Number(queryParams);
          // this.isEdit = true;
          this.getSiLoanApplicationsById(this.siLoanApplicationId);
        } else {
          this.isEdit = false;
        }
      });
  
      this.siGoldMortgageForm.valueChanges.subscribe((data: any) => {
        this.updateData();
      });
  
      this.siLandMortgageForm.valueChanges.subscribe((data: any) => {
        this.updateData();
      });
  
      this.siBondMortgageForm.valueChanges.subscribe((data: any) => {
        this.updateData();
      });
  
      this.siVehicleMortgageForm.valueChanges.subscribe((data: any) => {
        this.updateData();
      });
  
      this.siStorageMortgageForm.valueChanges.subscribe((data: any) => {
        this.updateData();
      });
  
      this.siOtherMortgageForm.valueChanges.subscribe((data: any) => {
        this.updateData();
      });
  
      this.propertyDetailsForm.valueChanges.subscribe((data: any) => {
        this.updateData();
      });
  
    }
  
    save() {
      this.updateData();
    }
  
    updateData() {
      if (this.collateralType == CollateralTypes.GOLD_MORTGAGE) {//gold
        this.showGoldform = true;
        this.siGoldLoanMortgageModel.collateralType = this.collateralType;
        this.siLoanApplicationService.changeData({
          formValid: this.siGoldMortgageForm.valid,
          data: this.siGoldLoanMortgageList,
          isDisable:  !(this.siGoldLoanMortgageList.length >0) ||  this.goldMortgagePopUp,
          stepperIndex: 7,
        });
      } else if (this.collateralType == CollateralTypes.LAND_MORTGAGE) {//land
        this.siLandLoanMortgageModel.collateralType = this.collateralType;
        this.siLandLoanMortgageModel.landTypeName = this.landTypeName;
        this.siLoanApplicationService.changeData({
          formValid: !this.siLandMortgageForm.valid ? true : false,
          data: this.siLandLoanMortgageModel,
          isDisable:  !(this.siLandLoanMortgageList.length >0)||  this.landMortgagePopUp,
          stepperIndex: 7,
        });
      } else if (this.collateralType == CollateralTypes.BONDS_MORTGAGE) {//bond
        this.siBondLoanMortgageModel.collateralType = this.collateralType;
        this.siLoanApplicationService.changeData({
          formValid: !this.siBondMortgageForm.valid ? true : false,
          data: this.siBondLoanMortgageModel,
          isDisable:  !(this.siBondLoanMortgageList.length >0)||  this.bondMortgagePopUp,
          stepperIndex: 7,
        });
      } else if (this.collateralType == CollateralTypes.VEHICLE_MORTGAGE) {//vehicle
  
        this.siVehicleLoanMortgageModel.collateralType = this.collateralType;
        this.siLoanApplicationService.changeData({
          formValid: !this.siVehicleMortgageForm.valid ? true : false,
          data: this.siVehicleLoanMortgageModel,
          isDisable: !this.siVehicleMortgageForm.valid, 
          stepperIndex: 7,
        });
      } else if (this.collateralType == CollateralTypes.STORAGE_MORTGAGE) {//storage
        this.siStorageLoanMortgageModel.collateralType = this.collateralType;
        this.siLoanApplicationService.changeData({
          formValid: !this.siStorageMortgageForm.valid ? true : false,
          data: this.siStorageLoanMortgageModel,
          isDisable:  !(this.siStorageLoanMortgageList.length >0)||  this.storagePopUp,
          stepperIndex: 7,
        });
      }else if (this.collateralType == CollateralTypes.PROPERTY_MORTGAGE) {//property
        this.siPropertyMortgageLoanModel.collateralType = this.collateralType;
        this.siLoanApplicationService.changeData({
          formValid: !this.siOtherMortgageForm.valid ? true : false,
          data: this.siPropertyMortgageLoanModel,
          isDisable:  !(this.siPropertyMortgageList.length >0)||  this.propertyPopUp,
          stepperIndex: 7,
        });
      } else if (this.collateralType == CollateralTypes.OTHER_MORTGAGE) {//other
        this.siOtherLoanMortgageModel.collateralType = this.collateralType;
        this.siLoanApplicationService.changeData({
          formValid: !this.siOtherMortgageForm.valid ? true : false,
          data: this.siOtherLoanMortgageModel,
          isDisable:  !(this.siOtherLoanMortgageList.length >0)||  this.otherMortgagePopUp,
          stepperIndex: 7,
        });
      } else {
        this.siLoanApplicationService.changeData({
          formValid: false,
          data: this.siOtherLoanMortgageModel,
          isDisable: true,
          stepperIndex: 7,
        });
      }
    }
   
    /**
     * @implements get all villages
     * @author k.yamuna
     */
    getAllVaillages(){
      this.villageService.getAllVillages().subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.villagesList = this.responseModel.data.filter((obj:any) => obj.status == applicationConstants.ACTIVE).map((obj: any) => {
            return { label: obj.name, value: obj.id };
          });
        } else {
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
        }
      });
    }
  
    /**
     * @implements get all land types
     */
    getAllLandTypes() {
      this.commonComponent.startSpinner();
      this.siLoanMortagageDetailsService.getAllLandTypes().subscribe(response => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.landTypesList = this.responseModel.data.filter((landType: { status: number; }) => landType.status == 1).map((landType: any) => {
            return { label: landType.name, value: landType.id };
          });
        }
      },
        error => {
          this.msgs = [];
          this.commonComponent.stopSpinner();
          this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
        })
    }
  
  
    /**
     * @implements get all BondTypes
     */
    getAllBondTypes() {
      this.commonComponent.startSpinner();
      this.siLoanMortagageDetailsService.getAllLandTypes().subscribe(response => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.bondTypesList = this.responseModel.data.filter((landType: { status: number; }) => landType.status == 1).map((landType: any) => {
            return { label: landType.name, value: landType.id };
          });
        }
      },
        error => {
          this.msgs = [];
          this.commonComponent.stopSpinner();
          this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
        })
    }
  
    /**
     * @implements get all land types
     */
    getAllLandOwnerShipTypes() {
      this.commonComponent.startSpinner();
      this.siLoanMortagageDetailsService.getAllLandownershipTypes().subscribe(response => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.landOwnershipTypesList = this.responseModel.data.filter((landType: { status: number; }) => landType.status == 1).map((landType: any) => {
            return { label: landType.name, value: landType.id };
          });
        }
      },
        error => {
          this.msgs = [];
          this.commonComponent.stopSpinner();
          this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
        })
    }
  
    /**
     * @implements onChange land Type
     * @param event 
     * -----un-unsed-- present
     */
    onChangeLandType(event: any) {
      if (event != null && event != undefined) {
        const filteredItem = this.landTypesList.find((item: { value: any; }) => item.value === event);
        this.landTypeName = filteredItem.label;
      }
    }
  
    /**
     * @implements get Collaterals by application id
     * @param siLoanApplicationId 
     * @author k.yamuna
     */
    getSiLoanApplicationsById(siLoanApplicationId: any) {
      this.commonFunctionsService
      this.siLoanApplicationService.getSILoanApplicationById(siLoanApplicationId).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel != null && this.responseModel != undefined) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
                if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                  this.siLoanApplicationModel = this.responseModel.data[0];
  
                  // strip date
                  if(this.siLoanApplicationModel.operationTypeName != null &&  this.siLoanApplicationModel.operationTypeName != undefined &&  this.siLoanApplicationModel.memberTypeName != MemberShipTypesData.INDIVIDUAL){
                    this.operationTypeName = applicationConstants.SINGLE_ACCOUNT_TYPE;
                  }
                  else if(this.siLoanApplicationModel.operationTypeName != null &&  this.siLoanApplicationModel.operationTypeName != undefined){
                    this.operationTypeName = this.siLoanApplicationModel.operationTypeName;
                  }
                  if(this.siLoanApplicationModel.siProductName != null && this.siLoanApplicationModel.siProductName != undefined)
                    this.siProductName = this.siLoanApplicationModel.siProductName;
                  if(this.siLoanApplicationModel.accountNumber != null && this.siLoanApplicationModel.accountNumber != undefined)
                    this.accountNumber = this.siLoanApplicationModel.accountNumber
                  if(this.siLoanApplicationModel.requestedAmount != null && this.siLoanApplicationModel.requestedAmount != undefined)
                    this.requestedAmount =this.siLoanApplicationModel.requestedAmount
  
                  //collatral get based on collateral type
                  this.getProductDefinitionByProductId(this.siLoanApplicationModel.siProductId);
                  if (this.siLoanApplicationModel.collateralType != undefined) {//gold
                    this.collateralType = this.siLoanApplicationModel.collateralType;
                    if (this.siLoanApplicationModel.collateralType == CollateralTypes.GOLD_MORTGAGE) {
                      this.showGoldform = true;
                      this.getSIGoldLoanMortgageDetailsByciLoanApplicationId(siLoanApplicationId ,false);
                    } else if (this.siLoanApplicationModel.collateralType == CollateralTypes.LAND_MORTGAGE) {//land
                      this.showLandform = true;
                      this.getSILandLoanMortgageDetailsByLoanAccId(siLoanApplicationId ,false);
                    } else if (this.siLoanApplicationModel.collateralType == CollateralTypes.BONDS_MORTGAGE) {//bond
                      this.showBondform = true;
                      this.getCIBondLoanMortgageDetailsByciLoanApplicationId(siLoanApplicationId ,false);
                    } else if (this.siLoanApplicationModel.collateralType == CollateralTypes.VEHICLE_MORTGAGE) {//vehicle
                      this.showVehicleform = true;
                      this.addButtonService = false;
                      this.getCIVehicleLoanMortgageDetailsByciLoanApplicationId(siLoanApplicationId , false);
                    } else if (this.siLoanApplicationModel.collateralType == CollateralTypes.STORAGE_MORTGAGE) {//storage
                      this.showStorageform = true;
                      this.getSIStorageLoanMortgageDetailsByLoanAccId(siLoanApplicationId,false) ;
                    } else if (this.siLoanApplicationModel.collateralType == CollateralTypes.PROPERTY_MORTGAGE) {//property
                      this.showpropertyForm = true;
                      this.getCiLoanProperyDetailsByApplication(siLoanApplicationId ,false);
                    }
                    else if (this.siLoanApplicationModel.collateralType == CollateralTypes.OTHER_MORTGAGE) {//other
                      this.showOtherform = true;
                      this.getSIOtherLoanMortgageDetailsByLoanAccId(siLoanApplicationId ,false);
                    }
                  }
                  this.updateData();
                }
              }
            }
          }
        }
      });
    }
  
     /**
     * @implements get product details by product id
     * @param id 
     * @author k.yamuna
     */
     getProductDefinitionByProductId(id: any) {
      this.siProductDefinitionService.getSIProductDefinitionById(id).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
              if (this.responseModel.data[0].ciProdCollateralsConfigDTOList) {
                // this.collateraltypeOptionsList = this.responseModel.data[0].ciProdCollateralsConfigDTOList
                //   .filter((item: any) => item != null && item.status === applicationConstants.ACTIVE)
                //   .map((item: { collateralTypeName: string, collateralType: any }) => ({
                //     label: item.collateralTypeName,
                //     value: item.collateralType
                //   }));
              }
            }
          }
          else {
            this.msgs = [];
            this.commonComponent.stopSpinner();
            this.msgs.push({ severity: 'error', detail: this.responseModel.statusMsg });
          }
        }
      });
    }
  
    /**
     * @implements onChange of Collateral
     * @param event 
     * @author k.yamuna
     */
    onChange(event: any) {
      this.getFormBasedOnCollateralType(event);
      this.collateralType = event;
      this.updateCollateralInCiApplicationDetails();
    }
  
    /**
     * @implements form based collateral type
     * @param collateralType 
     * @author k.yamuna
     */
    getFormBasedOnCollateralType(collateralType: any) {
  
      //collatral models
      this.siGoldLoanMortgageModel = new SiGoldLoanMortgage();
      this.siLandLoanMortgageModel = new SiLandLoanMortgage();
      this.siBondLoanMortgageModel = new SiBondLoanMortgage();
      this.siVehicleLoanMortgageModel = new SiVehicleLoanMortgage();
      this.siStorageLoanMortgageModel = new SiStorageLoanMortgage();
      this.siPropertyMortgageLoanModel = new SiPropertyMortgageLoan();
      this.siOtherLoanMortgageModel = new SiOtherLoanMortgage();
  
      this.isSameCollateral = false;
  
      //collatral type based form enable
      if (collateralType == CollateralTypes.GOLD_MORTGAGE) {//gold
        this.collateralType = collateralType;
        this.siGoldLoanMortgageModel.siLoanApplicationId = this.siLoanApplicationId;
        this.siGoldLoanMortgageModel.collateralType = this.collateralType;
        this.showGoldform = true;
        this.showLandform = false;
        this.showBondform = false;
        this.showVehicleform = false;
        this.showStorageform = false;
        this.showOtherform = false;
        this.showpropertyForm = false;
      } else if (collateralType== CollateralTypes.LAND_MORTGAGE) {//land
        this.collateralType = collateralType;
        this.siLandLoanMortgageModel.siLoanApplicationId = this.siLoanApplicationId;
        this.siLandLoanMortgageModel.collateralType = this.collateralType;
        this.showGoldform = false;
        this.showLandform = true;
        this.showBondform = false;
        this.showStorageform = false;
        this.showOtherform = false;
        this.showpropertyForm = false;
      } else if (collateralType == CollateralTypes.BONDS_MORTGAGE) {//bond
        this.collateralType = collateralType;
        this.siBondLoanMortgageModel.siLoanApplicationId = this.siLoanApplicationId;
        this.siBondLoanMortgageModel.collateralType = this.collateralType;
        this.showGoldform = false;
        this.showLandform = false;
        this.showBondform = true;
        this.showVehicleform = false;
        this.showStorageform = false;
        this.showOtherform = false;
        this.showpropertyForm = false;
      } else if (collateralType == CollateralTypes.VEHICLE_MORTGAGE) {//vehicle
        this.collateralType = collateralType;
        this.siVehicleLoanMortgageModel.siLoanApplicationId = this.siLoanApplicationId;
        this.siVehicleLoanMortgageModel.collateralType = this.collateralType;
        this.showGoldform = false;
        this.showLandform = false;
        this.showBondform = false;
        this.showVehicleform = true;
        this.showStorageform = false;
        this.showOtherform = false;
        this.showpropertyForm = false;
        this.addButtonService = false;
      } else if (collateralType == CollateralTypes.STORAGE_MORTGAGE) {//storage
        this.collateralType = collateralType;
        this.siStorageLoanMortgageModel.siLoanApplicationId = this.siLoanApplicationId;
        this.siStorageLoanMortgageModel.collateralType = this.collateralType;
        this.showGoldform = false;
        this.showLandform = false;
        this.showBondform = false;
        this.showVehicleform = false;
        this.showStorageform = true;
        this.showOtherform = false;
        this.showpropertyForm = false;
      } else if (collateralType == CollateralTypes.PROPERTY_MORTGAGE) {//property
        this.collateralType = collateralType;
        this.siPropertyMortgageLoanModel.siLoanApplicationId = this.siLoanApplicationId;
        this.siPropertyMortgageLoanModel.collateralType = this.collateralType;
        this.showGoldform = false;
        this.showLandform = false;
        this.showBondform = false;
        this.showVehicleform = false;
        this.showStorageform = false;
        this.showOtherform = false;
        this.showpropertyForm = true;
      } else if(collateralType == CollateralTypes.OTHER_MORTGAGE) {//other
        this.showGoldform = false;
        this.showLandform = false;
        this.showBondform = false;
        this.showVehicleform = false;
        this.showStorageform = false;
        this.showOtherform = true;
        this.showpropertyForm = false;
      }
      this.updateData();
    }
  
    /**
     * @implements get edit form based on collateral type
     * @param collateralType 
     * @modification k.yamuna
     */
    getEditFormBasedOnCollateralType(collateralType: any) {
  
      if (collateralType == CollateralTypes.GOLD_MORTGAGE) {//gold
        this.showGoldform = true;
        this.showLandform = false;
        this.showBondform = false;
        this.showVehicleform = false;
        this.showStorageform = false;
        this.showOtherform = false;
        this.showpropertyForm = false;
      } else if (collateralType == CollateralTypes.LAND_MORTGAGE) {//land
        this.showGoldform = false;
        this.showLandform = true;
        this.showBondform = false;
        this.showVehicleform = false;
        this.showStorageform = false;
        this.showOtherform = false;
        this.showpropertyForm = false;
      } else if (collateralType == CollateralTypes.BONDS_MORTGAGE) {//bond
        this.showGoldform = false;
        this.showLandform = false;
        this.showBondform = true;
        this.showVehicleform = false;
        this.showStorageform = false;
        this.showOtherform = false;
        this.showpropertyForm = false;
      } else if (collateralType == CollateralTypes.VEHICLE_MORTGAGE) {//vehicle
        this.showGoldform = false;
        this.showLandform = false;
        this.showBondform = false;
        this.showVehicleform = true;
        this.showStorageform = false;
        this.showOtherform = false;
        this.showpropertyForm = false;
      } else if (collateralType == CollateralTypes.STORAGE_MORTGAGE) {//storage
        this.showGoldform = false;
        this.showLandform = false;
        this.showBondform = false;
        this.showVehicleform = false;
        this.showStorageform = true;
        this.showOtherform = false;
        this.showpropertyForm = false;
      } else if (collateralType == CollateralTypes.PROPERTY_MORTGAGE) {//property
        this.showGoldform = false;
        this.showLandform = false;
        this.showBondform = false;
        this.showVehicleform = false;
        this.showStorageform = false;
        this.showOtherform = false;
        this.showpropertyForm = true;
      }
      else if (collateralType == CollateralTypes.OTHER_MORTGAGE) {//other
        this.showGoldform = false;
        this.showLandform = false;
        this.showBondform = false;
        this.showVehicleform = false;
        this.showStorageform = false;
        this.showOtherform = true;
        this.showpropertyForm = false;
      }
      this.updateData();
    }
  
   
    /**
     * @implements Get Gold Loan Mortgage detial by siLoanApplicationId and AdmissionNumber
     * @param siLoanApplicationId 
     * @param flag 
     * @modification k.yamuna
     */
    getSIGoldLoanMortgageDetailsByciLoanApplicationId(siLoanApplicationId: any , flag :Boolean) {
      this.siLoanMortagageDetailsService.getSIGoldLoanMortgageDetailsByLoanAccId(siLoanApplicationId).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          this.isEdit = true;
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              this.siGoldLoanMortgageList = this.responseModel.data;
              if (this.siLoanApplicationModel.collateralType != null && this.siLoanApplicationModel.collateralType != undefined)
                this.getEditFormBasedOnCollateralType(this.siLoanApplicationModel.collateralType);
              this.siLoanApplicationModel.collateralType = this.collateralType;
              this.updateData();
            }
          }
          else if(!flag){
            this.siLoanApplicationModel.collateralType = null;
          }
        }
      });
    }
  
    /**
     * @implements Get Land Loan Mortgage detial by siLoanApplicationId and AdmissionNumber
     * @param siLoanApplicationId 
     * @param flag 
     * @modification k.yamuna
     */
    getSILandLoanMortgageDetailsByLoanAccId(siLoanApplicationId: any ,flag :any) {
      this.siLoanMortagageDetailsService.getSILandLoanMortagageDetailsById(siLoanApplicationId).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          this.isEdit = true;
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              this.siLandLoanMortgageList = this.responseModel.data.map((obj: any) => {
                if(obj.villageId != null && obj.villageId != undefined){
                  let villageName  = this.villagesList.filter((village:any) => village.value == obj.villageId);
                  obj.villageName = villageName[0].label;
                }
                return obj;
              });
              if (this.siLoanApplicationModel.collateralType != null && this.siLoanApplicationModel.collateralType != undefined)
                this.getEditFormBasedOnCollateralType(this.siLoanApplicationModel.collateralType);
              this.siLoanApplicationModel.collateralType = this.collateralType;
              // this.updateData();
            }
          }
          else if(!flag){
            this.siLoanApplicationModel.collateralType = null;
          }
          this.updateData();
        }
      });
    }
  
  
    /**
     * @implements Get BOnd Loan Mortgage detial by siLoanApplicationId and AdmissionNumber
     * @param siLoanApplicationId 
     * @param flag 
     * @author k.yamuna
     */
    getCIBondLoanMortgageDetailsByciLoanApplicationId(siLoanApplicationId: any , flag :Boolean) {
      this.commonFunctionsService
      this.siLoanMortagageDetailsService.getSIBondLoanMortagageDetailsByApplicationId(siLoanApplicationId).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          this.isEdit = true;
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              this.siBondLoanMortgageList = this.responseModel.data.map((bond: any) => {
                bond.bondIssuedDateVal =  this.datePipe.transform(bond.bondIssuedDate, this.orgnizationSetting.datePipe);
                bond.bondMaturityDateVal =  this.datePipe.transform(bond.bondMaturityDate, this.orgnizationSetting.datePipe);
                let bondTypeName =  this.bondTypesList.filter((obj:any) => obj.value == bond.bondType);//bond type name
                if(bondTypeName != null && bondTypeName != undefined && bondTypeName.length >0)
                  bond.bondTypeName = bondTypeName[0].label;
                return bond;
              }
            );
              if (this.siLoanApplicationModel.collateralType != null && this.siLoanApplicationModel.collateralType != undefined)
                this.getEditFormBasedOnCollateralType(this.siLoanApplicationModel.collateralType);
              this.siLoanApplicationModel.collateralType = this.collateralType;
              this.updateData();
            }
          }
          else if(!flag){
            this.siLoanApplicationModel.collateralType = null;
            
          }
        }
      });
    }
    
    /**
     * @implements Get Vehicle Loan Mortgage detial by siLoanApplicationId and AdmissionNumber
     * @param siLoanApplicationId 
     * @param flag 
     * @modification k.yamuna
     */
    getCIVehicleLoanMortgageDetailsByciLoanApplicationId(siLoanApplicationId: any ,flag :boolean) {
      this.commonFunctionsService
      this.siLoanVehicleMortgageDetailsService.getDetailsBySILoanApplicationId(siLoanApplicationId).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          this.isEdit = true;
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length >0) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              this.siVehicleLoanMortgageList = this.responseModel.data;
              this.siVehicleLoanMortgageModel = this.siVehicleLoanMortgageList [0];
              this.addButtonService = true;
              if (this.siLoanApplicationModel.collateralType != null && this.siLoanApplicationModel.collateralType != undefined)
                this.getEditFormBasedOnCollateralType(this.siLoanApplicationModel.collateralType);
              this.siLoanApplicationModel.collateralType = this.collateralType;
              this.updateData();
            }
          }
          else if(!flag){
            this.siLoanApplicationModel.collateralType = null;
            
          }
        }
      });
    }
  
    
    /**
     * @implements Get Storage Loan Mortgage detial by siLoanApplicationId and AdmissionNumber
     * @param siLoanApplicationId 
     * @param flag 
     * @modification k.yamuna
     */
    getSIStorageLoanMortgageDetailsByLoanAccId(siLoanApplicationId: any , flag :Boolean) {
      this.commonFunctionsService
      this.siLoanMortagageDetailsService.getSIStorageLoanMortagageDetailsByApplicationId(siLoanApplicationId).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          this.isEdit = true;
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              this.siStorageLoanMortgageList = this.responseModel.data.map((obj: any) => {
                if(obj.dateOfIssue != null && obj.dateOfIssue != undefined){
                  obj.dateOfIssueVal = this.datePipe.transform(obj.dateOfIssue, this.orgnizationSetting.datePipe);
                }
                return obj;
              });
  
              if (this.siLoanApplicationModel.collateralType != null && this.siLoanApplicationModel.collateralType != undefined)
                this.getEditFormBasedOnCollateralType(this.siLoanApplicationModel.collateralType);
              this.siLoanApplicationModel.collateralType = this.collateralType;
              this.updateData();
            }
          }
          else if(!flag){
            this.siLoanApplicationModel.collateralType = null;
           
          }
        }
      });
    }
  
   
     /**
     * @implements Get Other Loan Mortgage detial by siLoanApplicationId and AdmissionNumber
     * @param siLoanApplicationId 
     * @param flag 
     * @modification k.yamuna
     */
    getSIOtherLoanMortgageDetailsByLoanAccId(siLoanApplicationId: any , flag :Boolean) {
      this.commonFunctionsService
      this.siOtherMortgageDetailsService.getDetailsBySILoanApplicationId(siLoanApplicationId).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          this.isEdit = true;
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              this.siOtherLoanMortgageList = this.responseModel.data;
              if (this.siLoanApplicationModel.collateralType != null && this.siLoanApplicationModel.collateralType != undefined)
                this.getEditFormBasedOnCollateralType(this.siLoanApplicationModel.collateralType);
              this.siLoanApplicationModel.collateralType = this.collateralType;
              this.updateData();
            }
          }
          else if(!flag){
            this.siLoanApplicationModel.collateralType = null;
            // this.collateralType = null;
          }
        }
      });
    }
  
    // /**
    //  * un-Used Function
    //  * @param siLoanApplicationId 
    //  */
    // getCILoanMortgageDetailsByciLoanApplicationId(siLoanApplicationId: any) {
    //   this.siLoanMortagageDetailsService.getCiBondMortgageLoanDetailsByApplicationId(siLoanApplicationId).subscribe((response: any) => {
    //     this.responseModel = response;
    //     if (this.responseModel != null && this.responseModel != undefined) {
    //       if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
    //         if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
    //           this.siGoldLoanMortgageModel = this.responseModel.data[0];
    //           this.siLoanApplicationService.changeData({
    //             formValid: this.siGoldMortgageForm.valid,
    //             data: this.siGoldLoanMortgageModel,
    //             isDisable: (!this.siGoldMortgageForm.valid),
    //             stepperIndex: 5,
    //           });
    //         }
    //       }
    //     }
    //   }, error => {
    //     this.commonComponent.stopSpinner();
    //     this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
    //     setTimeout(() => {
    //       this.msgs = [];
    //     }, 3000);
    //   });
    // }
    
    /**
     * @implements ci Loan Propery Details by Application Id
     * @param siLoanApplicationId 
     * @author k.yamuna
     */
    getCiLoanProperyDetailsByApplication(siLoanApplicationId: any, flag: Boolean) {
      this.commonFunctionsService
      this.siPropertyMortgageList = [];
      this.siLoanMortagageDetailsService.getSiProperyMortgageLoanDetailsByApplicationId(siLoanApplicationId).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          this.isEdit = true;
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              this.siPropertyMortgageList = this.responseModel.data;
              if (this.siLoanApplicationModel.collateralType != null && this.siLoanApplicationModel.collateralType != undefined)
                this.getEditFormBasedOnCollateralType(this.siLoanApplicationModel.collateralType);
              this.siLoanApplicationModel.collateralType = this.collateralType;
              this.updateData();
            }
          }
          else if (!flag) {
            this.siLoanApplicationModel.collateralType = null;
            // this.collateralType = null;
          }
        }
      });
  
    }
  
    /**
     * @implements add gold loand mortgage
     * @Modification k.yamuna
     */
    addGoldLoanMortgage() {
      this.siGoldLoanMortgageModel = new SiGoldLoanMortgage();
      this.goldMortgagePopUp = true;
      this.addButtonService = true;
      this.editDeleteDisable = true;
      /**
       * for update validation
       */
      this.updateData();
    }
  
    /**
     * @implements add land mortgage
     * @Modification k.yamuna
     */
    addLandLoanMortgage() {
      this.landMortgagePopUp = true;
      this.siLandLoanMortgageModel = new SiLandLoanMortgage();
      this.addButtonService = true;
      this.editDeleteDisable = true;
      this.updateData();
    }
  
  
    /**
     * @implements add bond loan mortgage
     * @Modification k.yamuna
     */
    addBondLoanMortgage() {
      this.bondMortgagePopUp = true;
      this.siBondLoanMortgageModel = new SiBondLoanMortgage();
      this.addButtonService = true;
      this.editDeleteDisable = true;
      this.updateData();
    }
  
    /**
     * @implements add vehicle
     * @modification k.yamuna
     */
    addVehicleLoanMortgage() {
      this.siVehicleLoanMortgageModel = new SiVehicleLoanMortgage();
      this.addButtonService = true;
      this.editDeleteDisable = true;
      this.updateData();
    }
  
    /**
     * @implements add storage
     * @modification k.yamuna
     */
    addStorageLoanMortgage() {
      this.siStorageLoanMortgageModel = new SiStorageLoanMortgage();
      this.addButtonService = true;
      this.storagePopUp = true;
      this.editDeleteDisable = true;
      this.updateData();
    }
  
    /**
     * @implements add other loan mortgage
     * @modification k.yamuna
     */
    addOtherLoanMortgage() {
      this.siOtherLoanMortgageModel = new SiOtherLoanMortgage();
      this.addButtonService = true;
      this.editDeleteDisable = true;
      this.otherMortgagePopUp = true;
      this.updateData();
    }
  
    /**
     * @implements save gold loand mortgage
     * @param row 
     * @modification k.yamuna
     */
    saveGoldLoanMortgage(row: any) {
      this.addButtonService = false;
      this.editDeleteDisable = false;
      this.goldMortgagePopUp = false;
      this.siGoldLoanMortgageModel = row;
      this.siGoldLoanMortgageModel.siLoanApplicationId = this.siLoanApplicationId;
      this.siGoldLoanMortgageModel.admissionNo = this.siLoanApplicationModel.admissionNo;
      // this.siGoldLoanMortgageModel.status = applicationConstants.ACTIVE;
      this.updateData();
      if (row.id != null && row.id != undefined) {
        this.siLoanMortagageDetailsService.updateSIBondLoanMortagageDetails(this.siGoldLoanMortgageModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel != null && this.responseModel != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.siGoldLoanMortgageModel = this.responseModel.data;
                this.addButtonService = false;
                if (this.responseModel.data[0].siLoanApplicationId != null && this.responseModel.data[0].siLoanApplicationId != undefined) {
                  this.getSIGoldLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].siLoanApplicationId ,false);
                }
              }
            }
            else {
              this.msgs = [];
              this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
          }
        }, error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        });
      }
      else {
        this.siLoanMortagageDetailsService.addSIGoldLoanMortagageDetails(this.siGoldLoanMortgageModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel != null && this.responseModel != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.siGoldLoanMortgageModel = this.responseModel.data;
                this.addButtonService = false;
                if (this.responseModel.data[0].siLoanApplicationId != null && this.responseModel.data[0].siLoanApplicationId != undefined) {
                  this.getSIGoldLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].siLoanApplicationId , false);
                }
              }
            }
            else {
              this.msgs = [];
              this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
          }
        }, error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        });
      }
    }
  
    /**
     * @implements save land mortgage details
     * @param row 
     * @modifiction k.yamuna
     */
    saveLandLoanMortgage(row: any) {
      this.landMortgagePopUp = false;
      this.addButtonService = false;
      this.editDeleteDisable = false;
      this.siLandLoanMortgageModel = row;
      this.siLandLoanMortgageModel.admissionNo = this.siLoanApplicationModel.admissionNo;
      this.siLandLoanMortgageModel.siLoanApplicationId = this.siLoanApplicationId;
      this.siLandLoanMortgageModel.mortgageDeedDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siLandLoanMortgageModel.mortgageDeedDateVal));
      // this.siLandLoanMortgageModel.status = applicationConstants.ACTIVE;
      this.updateData();
      if (row.id != null && row.id != undefined) {
        this.siLoanMortagageDetailsService.updateSILandLoanMortagageDetails(this.siLandLoanMortgageModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel != null && this.responseModel != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.siLandLoanMortgageModel = this.responseModel.data;
                this.addButtonService = false;
                if (this.responseModel.data[0].siLoanApplicationId != null && this.responseModel.data[0].siLoanApplicationId != undefined) {
                  this.getSILandLoanMortgageDetailsByLoanAccId(this.responseModel.data[0].siLoanApplicationId ,false);
                }
              }
            }
            else {
              this.msgs = [];
              this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
          }
        }, error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        });
      }
      else {
        this.siLoanMortagageDetailsService.addSILandLoanMortagageDetails(this.siLandLoanMortgageModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel != null && this.responseModel != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.siLandLoanMortgageModel = this.responseModel.data;
                this.addButtonService = false;
                if (this.responseModel.data[0].siLoanApplicationId != null && this.responseModel.data[0].siLoanApplicationId != undefined) {
                  this.getSILandLoanMortgageDetailsByLoanAccId(this.responseModel.data[0].siLoanApplicationId ,false);
                }
              }
            }
            else {
              this.msgs = [];
              this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
          }
        }, error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        });
      }
    }
  
    /**
     * @implements save Bond Mortgage
     * @param row 
     * @modification k.yamuna
     */
    saveBondLoanMortgage(row: any) {
      this.bondMortgagePopUp = false;//pop up
      this.addButtonService = false;
      this.editDeleteDisable = false;
      this.siBondLoanMortgageModel = row;
      this.siBondLoanMortgageModel.siLoanApplicationId = this.siLoanApplicationId;
      this.siBondLoanMortgageModel.admissionNo = this.siLoanApplicationModel.admissionNo;
      this.siBondLoanMortgageModel.bondIssuedDate = this.commonFunctionsService.getUTCEpoch(new Date(row.bondIssuedDateVal));
      this.siBondLoanMortgageModel.bondMaturityDate = this.commonFunctionsService.getUTCEpoch(new Date(row.bondMaturityDateVal));
      // this.siBondLoanMortgageModel.status = applicationConstants.ACTIVE;
      this.updateData();
      if (row.id != null && row.id != undefined) {
        this.siLoanMortagageDetailsService.updateSIBondLoanMortagageDetails(this.siBondLoanMortgageModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel != null && this.responseModel != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.siBondLoanMortgageModel = this.responseModel.data;
                this.addButtonService = false;
                if (this.responseModel.data[0].siLoanApplicationId != null && this.responseModel.data[0].siLoanApplicationId != undefined) {
                  this.getCIBondLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].siLoanApplicationId ,false);
                }
              }
            }
            else {
              this.msgs = [];
              this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
          }
        }, error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        });
      }
      else {
        this.siLoanMortagageDetailsService.addSIBondLoanMortagageDetails(this.siBondLoanMortgageModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel != null && this.responseModel != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.siBondLoanMortgageModel = this.responseModel.data;
                this.addButtonService = false;
                if (this.responseModel.data[0].siLoanApplicationId != null && this.responseModel.data[0].siLoanApplicationId != undefined) {
                  this.getCIBondLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].siLoanApplicationId ,false);
                }
              }
            }
            else {
              this.msgs = [];
              this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
          }
        }, error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        });
      }
    }
  
    /**
     * @implements save vahicles 
     * @param row 
     * @modification k.yamuna
     */
    saveVehicleLoanMortgage(row: any) {
      this.addButtonService = false;
      this.editDeleteDisable = false;
      this.siVehicleLoanMortgageModel = row;
      this.siVehicleLoanMortgageModel.siLoanApplicationId = this.siLoanApplicationId;
      this.siVehicleLoanMortgageModel.admissionNo = this.siLoanApplicationModel.admissionNo;
      // this.siVehicleLoanMortgageModel.status = applicationConstants.ACTIVE;
      this.updateData();
      if (row.id != null && row.id != undefined) {
        this.siLoanMortagageDetailsService.updateSIVehicleLoanMortagageDetails(this.siVehicleLoanMortgageModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel != null && this.responseModel != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.siVehicleLoanMortgageModel = this.responseModel.data[0];
                this.addButtonService = false;
                this.getCIVehicleLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].siLoanApplicationId , false);
              }
            }
            else {
              this.msgs = [];
              this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
          }
        }, error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        });
      }
      else {
        this.siLoanMortagageDetailsService.addSIVehicleLoanMortagageDetails(this.siVehicleLoanMortgageModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel != null && this.responseModel != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.siVehicleLoanMortgageModel = this.responseModel.data[0];
                this.addButtonService = false;
                if (this.responseModel.data[0].siLoanApplicationId != null && this.responseModel.data[0].siLoanApplicationId != undefined) {
                  this.getCIVehicleLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].siLoanApplicationId , false);
                }
              }
            }
            else {
              this.msgs = [];
              this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
          }
        }, error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        });
      }
    }
  
    /**
     * @implements save storage
     * @param row 
     * @modification k.yamuna
     */
    saveStorageLoanMortgage(row: any) {
      this.storagePopUp = false;
      this.addButtonService = false;
      this.editDeleteDisable = false;
      this.siStorageLoanMortgageModel = row;
      this.siStorageLoanMortgageModel.siLoanApplicationId = this.siLoanApplicationId;
      this.siStorageLoanMortgageModel.admissionNo = this.siLoanApplicationModel.admissionNo;
      // this.siStorageLoanMortgageModel.status = applicationConstants.ACTIVE;
      this.siStorageLoanMortgageModel.dateOfIssue = this.commonFunctionsService.getUTCEpoch(new Date(this.siStorageLoanMortgageModel.dateOfIssueVal));
      this.updateData();
      if (row.id != null && row.id != undefined) {
        this.siLoanMortagageDetailsService.updateSIStorageLoanMortagageDetails(this.siStorageLoanMortgageModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel != null && this.responseModel != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.siStorageLoanMortgageModel = this.responseModel.data;
                this.addButtonService = false;
                if (this.responseModel.data[0].siLoanApplicationId != null && this.responseModel.data[0].siLoanApplicationId != undefined) {
                  this.getSIStorageLoanMortgageDetailsByLoanAccId(this.responseModel.data[0].siLoanApplicationId , false);
                }
              }
            }
            else {
              this.msgs = [];
              this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
          }
        }, error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        });
      }
      else {
        this.siLoanMortagageDetailsService.addSIStorageLoanMortagageDetails(this.siStorageLoanMortgageModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel != null && this.responseModel != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.siStorageLoanMortgageModel = this.responseModel.data;
                this.addButtonService = false;
                if (this.responseModel.data[0].siLoanApplicationId != null && this.responseModel.data[0].siLoanApplicationId != undefined) {
                  this.getSIStorageLoanMortgageDetailsByLoanAccId(this.responseModel.data[0].siLoanApplicationId ,false);
                }
              }
            }
            else {
              this.msgs = [];
              this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
          }
        }, error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        });
      }
    }
  
    /**
     * @implements save other loand mortgage
     * @param row 
     * @author k.yamuna
     */
    saveOtherLoanMortgage(row: any) {
      this.otherMortgagePopUp = false;
      this.addButtonService = false;
      this.editDeleteDisable = false;
      this.siOtherLoanMortgageModel = row;
      this.siOtherLoanMortgageModel.siLoanApplicationId = this.siLoanApplicationId;
      // this.siOtherLoanMortgageModel.admissionNo = this.siLoanApplicationModel.admissionNo;
      // this.siOtherLoanMortgageModel.status = applicationConstants.ACTIVE;
      this.updateData();
      if (row.id != null && row.id != undefined) {
        this.siLoanMortagageDetailsService.updateSIOtherLoanMortagageDetails(this.siOtherLoanMortgageModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel != null && this.responseModel != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.siOtherLoanMortgageModel = this.responseModel.data;
                this.addButtonService = false;
                if (this.responseModel.data[0].siLoanApplicationId != null && this.responseModel.data[0].siLoanApplicationId != undefined) {
                  this.getSIOtherLoanMortgageDetailsByLoanAccId(this.responseModel.data[0].siLoanApplicationId ,false);
                }
              }
            }
            else {
              this.msgs = [];
              this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
          }
        }, error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        });
      }
      else {
        this.siLoanMortagageDetailsService.addSIOtherLoanMortagageDetails(this.siOtherLoanMortgageModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel != null && this.responseModel != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.siOtherLoanMortgageModel = this.responseModel.data;
                this.addButtonService = false;
                if (this.responseModel.data[0].siLoanApplicationId != null && this.responseModel.data[0].siLoanApplicationId != undefined) {
                  this.getSIOtherLoanMortgageDetailsByLoanAccId(this.responseModel.data[0].siLoanApplicationId ,false);
                }
              }
            }
            else {
              this.msgs = [];
              this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
          }
        }, error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        });
      }
    }
  
    /**
     * @implements save or update property
     * @param row 
     * @author k.yamuna
     */
    saveOrUpdateProperty(row:any){
      this.propertyPopUp = false;
      this.addButtonService = false;
      this.editDeleteDisable = false;
      this.siOtherLoanMortgageModel = row;
      this.siOtherLoanMortgageModel.siLoanApplicationId = this.siLoanApplicationId;
      this.updateData();
      if (row.id != null && row.id != undefined) {
        this.siLoanMortagageDetailsService.updateSIPropertyLoanMortagageDetails(this.siPropertyMortgageLoanModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel != null && this.responseModel != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.siOtherLoanMortgageModel = this.responseModel.data;
                this.addButtonService = false;
                if (this.responseModel.data[0].siLoanApplicationId != null && this.responseModel.data[0].siLoanApplicationId != undefined) {
                  this.getCiLoanProperyDetailsByApplication(this.responseModel.data[0].siLoanApplicationId ,false);
                }
              }
            }
            else {
              this.msgs = [];
              this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
          }
        }, error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        });
      }
      else {
        this.siLoanMortagageDetailsService.addSIPropertyLoanMortagageDetails(this.siPropertyMortgageLoanModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel != null && this.responseModel != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.siOtherLoanMortgageModel = this.responseModel.data;
                this.addButtonService = false;
                if (this.responseModel.data[0].siLoanApplicationId != null && this.responseModel.data[0].siLoanApplicationId != undefined) {
                  this.getCiLoanProperyDetailsByApplication(this.responseModel.data[0].siLoanApplicationId ,false);
                }
              }
            }
            else {
              this.msgs = [];
              this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
          }
        }, error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        });
      }
    }
  
    /**
     * @implements cancle gold Loan
     * @author k.yamuna
     */
    cancelGoldLoanMortgage() {
      this.siGoldLoanMortgageList = [];
      this.goldMortgagePopUp = false;
      this.addButtonService = false;
      this.editDeleteDisable = false;
      this.getSIGoldLoanMortgageDetailsByciLoanApplicationId(this.siLoanApplicationId ,false);
    }
  
    /**
     * @implements cancle land mortgage details
     * @author k.yamuna
     */
    cancelLandLoanMortgage() {
      this.landMortgagePopUp = false;
      this.siLandLoanMortgageList = [];
      this.addButtonService = false;
      this.editDeleteDisable = false;
      this.getSILandLoanMortgageDetailsByLoanAccId(this.siLoanApplicationId ,false);
    }
  
    /**
     * @implements cancle bond 
     * @modification k.yamuna
     */
    cancelBondLoanMortgage() {
      this.bondMortgagePopUp = false;//pop up
      this.siBondLoanMortgageList = [];
      this.addButtonService = false;
      this.editDeleteDisable = false;
      this.getCIBondLoanMortgageDetailsByciLoanApplicationId(this.siLoanApplicationId ,false);
    }
  
    /**
     * @implements cancle vehicle loan
     * @modification k.yamuna
     */
    cancelVehicleLoanMortgage() {
      this.siVehicleLoanMortgageList = [];
      this.addButtonService = false;
      this.editDeleteDisable = false;
      this.getCIVehicleLoanMortgageDetailsByciLoanApplicationId(this.siLoanApplicationId , false);
    }
  
    /**
     * @implements cancle storage
     * @modification k.yamuna
     */
    cancelStorageLoanMortgage() {
      this.storagePopUp = false;
      this.siStorageLoanMortgageList = [];
      this.addButtonService = false;
      this.editDeleteDisable = false;
      this.getSIStorageLoanMortgageDetailsByLoanAccId(this.siLoanApplicationId ,false);
    }
  
    /**
     * @implements cancle other loan mortgage
     * @modification k.yamuna
     */
    cancelOtherLoanMortgage() {
      this.otherMortgagePopUp = false;
      this.siOtherLoanMortgageList = [];
      this.addButtonService = false;
      this.editDeleteDisable = false;
      this.getSIOtherLoanMortgageDetailsByLoanAccId(this.siLoanApplicationId ,false);
    }
  
    /**
     * @implements cancle property
     * @modification k.yamuna
     */
    propertyCancel(){
      this.siPropertyMortgageList = [];
      this.propertyPopUp = false;
      this.addButtonService = false;
      this.editDeleteDisable = false;
      this.getCiLoanProperyDetailsByApplication(this.siLoanApplicationId ,false);
    }
  
  
     /**
     * @implements edin gold loan mortgage
     * @param rowData 
     * @author k.yamuna
     */
    editGoldLoanMortgage(rowData: any) {
      this.addButtonService = true;
      this.editDeleteDisable = true;
      this.goldMortgagePopUp = true;
      this.updateData();
      this.siLoanMortagageDetailsService.getSIGoldLoanMortagageDetailsId(rowData.id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.siGoldLoanMortgageModel = this.responseModel.data[0];
              
            }
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
   /**
     * @implements edin Land loan mortgage
     * @param rowData 
     * @author k.yamuna
     */
    editLandLoanMortgage(rowData: any) {
      this.landMortgagePopUp = true;
      this.addButtonService = true;
      this.editDeleteDisable = true;
      this.updateData();
      this.siLoanMortagageDetailsService.getSILandLoanMortagageById(rowData.id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.siLandLoanMortgageModel = this.responseModel.data[0];
              this.siLandLoanMortgageModel.mortgageDeedDateVal = this.datePipe.transform(this.siLandLoanMortgageModel.mortgageDeedDate, this.orgnizationSetting.datePipe);
  
            }
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  
    /**
     * @implements edin bond loan mortgage
     * @param rowData 
     * @author k.yamuna
     */
    editBondLoanMortgage(rowData: any) {
      this.bondMortgagePopUp = true;
      this.addButtonService = true;
      this.editDeleteDisable = true;
      this.updateData();
      this.siLoanMortagageDetailsService.getSIBondLoanMortagageDetailsById(rowData.id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.siBondLoanMortgageModel = this.responseModel.data[0];
              this.siBondLoanMortgageModel.bondIssuedDateVal =  this.datePipe.transform(this.siBondLoanMortgageModel.bondIssuedDate, this.orgnizationSetting.datePipe);
              this. siBondLoanMortgageModel.bondMaturityDateVal =  this.datePipe.transform(this. siBondLoanMortgageModel.bondMaturityDate, this.orgnizationSetting.datePipe);
            }
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  
    /**
     * @implements edit vehicle loan mortgage
     * @param rowData 
     * @modification k.yamuna
     */
    editVehicleLoanMortgage(rowData: any) {
      this.addButtonService = true;
      this.editDeleteDisable = true;
      this.updateData();
      this.siLoanMortagageDetailsService.getSIVehicleLoanMortagageDetailsById(rowData.id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.siVehicleLoanMortgageModel = this.responseModel.data[0];
            }
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  
    /**
     * @implements edit storage
     * @param rowData 
     * @modifacation k.yamuna
     */
    editStorageLoanMortgage(rowData: any) {
      this.addButtonService = true;
      this.editDeleteDisable = true;
      this.storagePopUp = true;
      this.updateData();
      this.siLoanMortagageDetailsService.getSIStorageLoanMortagageDetailsById(rowData.id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.siStorageLoanMortgageModel = this.responseModel.data[0];
              this.siStorageLoanMortgageModel.dateOfIssueVal = this.datePipe.transform(this.siStorageLoanMortgageModel.dateOfIssue, this.orgnizationSetting.datePipe);
            }
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  
    /**
     * @implements edit other mortgage
     * @param rowData 
     * @modification k.yamuna
     */
    editOtherLoanMortgage(rowData: any) {
      this.otherMortgagePopUp = true;
      this.addButtonService = true;
      this.editDeleteDisable = true;
      this.updateData();
      this.siLoanMortagageDetailsService.getSIOtherLoanMortagageDetailsById(rowData.id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.siOtherLoanMortgageModel = this.responseModel.data[0];
            }
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  
    /**
     * @implements edit property mortgage
     * @param rowData 
     * @author k.yamuna
     */
    editProperty(rowData:any){
      this.propertyPopUp = true;
      this.addButtonService = true;
      this.editDeleteDisable = true;
      this.updateData();
      this.siLoanMortagageDetailsService.getSIPropertyLoanMortagageDetailsById(rowData.id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.siPropertyMortgageLoanModel = this.responseModel.data[0];
            }
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  
    /**
     * @implements delete gold Loan Mortgagae
     * @param row 
     * @modifictaion k.yamuna
     */
    deleteGoldLoanMortgage(row: any) {
      this.siGoldLoanMortgageList = [];
      this.siLoanMortagageDetailsService.deleteSIGoldLoanMortagageDetails(row.id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.getSIGoldLoanMortgageDetailsByciLoanApplicationId(this.siLoanApplicationId ,false);
          this.msgs = [];
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      });
    }
  
    /**
     * @implements delete land loan mortgage
     * @param row 
     * @modification k.yamuna
     */
    deleteLandLoanMortgage(row: any) {
      this.siLandLoanMortgageList = [];
      this.siLoanMortagageDetailsService.deleteSILandLoanMortagageDetails(row.id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.getSILandLoanMortgageDetailsByLoanAccId(this.siLoanApplicationId ,false);
          this.msgs = [];
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      });
    }
  
    /**
     * @implements delete bond loan mortgagw
     * @param row 
     * @author k.yamuna
     */
    deleteBondLoanMortgage(row: any) {
      this.siLoanMortagageDetailsService.deleteSIBondLoanMortagageDetails(row.id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.siBondLoanMortgageList = this.responseModel.data;
          this.getCIBondLoanMortgageDetailsByciLoanApplicationId(this.siLoanApplicationId ,false);
          this.msgs = [];
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      });
    }
  
    /**
     * @implements delete vihicle
     * @param row 
     * @author k.yamuna
     */
    deleteVehicleLoanMortgage(row: any) {
      this.siLoanMortagageDetailsService.deleteSIVehicleLoanMortagageDetails(row.id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.siVehicleLoanMortgageList = this.responseModel.data;
          this.getCIVehicleLoanMortgageDetailsByciLoanApplicationId(this.siLoanApplicationId , false);
          this.msgs = [];
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      });
    }
  
    /**
     * @implements delete storage 
     * @param row 
     * @modification k.yamuna
     */
    deleteStorageLoanMortgage(row: any) {
      this.siLoanMortagageDetailsService.deleteSIStorageLoanMortagageDetails(row.id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.siStorageLoanMortgageList = this.responseModel.data;
          this.getSIStorageLoanMortgageDetailsByLoanAccId(this.siLoanApplicationId ,false);
          this.msgs = [];
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      });
    }
  
    /**
     * @implements delete other loan mortgage
     * @param row 
     * @author k.yamuna
     */
    deleteOtherLoanMortgage(row: any) {
      this.siLoanMortagageDetailsService.deleteSIOtherLoanMortagageDetails(row.id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.siOtherLoanMortgageList = this.responseModel.data;
          this.getSIOtherLoanMortgageDetailsByLoanAccId(this.siLoanApplicationId ,false);
          this.msgs = [];
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      });
    }
  
    /**
     * @implements delete propert loan mortagage
     * @author k.yamuna
     * @param row 
     */
    deleteProperyLoanMortgage(row:any){
      this.siLoanMortagageDetailsService.deleteSIPropertyLoanMortagageDetails(row.id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.siOtherLoanMortgageList = this.responseModel.data;
          this.getCiLoanProperyDetailsByApplication(this.siLoanApplicationId ,false);
          this.msgs = [];
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
        }
      });
    }
  
  
    /**
     * @implements update collateral in ci application Details
     * @author k.yamuna
     * 
     */
    updateCollateralInCiApplicationDetails() {
      this.siLoanApplicationModel.collateralType = this.collateralType;
      this.siLoanApplicationService.updateSILoanApplication(this.siLoanApplicationModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != undefined && this.responseModel.data[0] != null) {
            if (this.responseModel.data[0].id != undefined && this.responseModel.data[0].id != null) {
              this.siLoanApplicationModel = this.responseModel.data[0];
              this.siLoanApplicationModel.collateralType = null; //to make collateral type in enable mode till atleast on record created
            }
          }
          // this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          // setTimeout(() => {
          //   this.msgs = [];
          // }, 1200);
        } else {
          // this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          // setTimeout(() => {
          //   this.msgs = [];
          // }, 3000);
        }
      }, error => {
        // this.commonComponent.stopSpinner();
        // this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        // setTimeout(() => {
        //   this.msgs = [];
        // }, 3000);
      }
    );
    }
  
    saveOrUpdateSurety(obj:any){
  
      
    }
    suretyCancel(){
  
    }
  
    editsurety(obj:any){
  
    }
  
    searchAdmissionNumber(obj:any){
  
    }
  
    getAclassmemDataByadmissionNumber(obj:any){
  
    }
  
    /**
     * @implements add property mortgage
     * @autho 
     * k.yamuna
     */
    addPropertyLoanMortgage(){
      this.propertyPopUp = true;
      this.siPropertyMortgageLoanModel = new SiPropertyMortgageLoan();
      this.addButtonService = true;
      this.editDeleteDisable = true;
      /**
       * for update validation
       */
      this.updateData();
    }

    checkDuplicateSurveyNoInTable(siLandLoanMortgageModel: any) {
        debugger
        if (null != siLandLoanMortgageModel && undefined != siLandLoanMortgageModel) {
          let obj = [];
          if (this.siLandLoanMortgageList != undefined && this.siLandLoanMortgageList != null && this.siLandLoanMortgageList.length != 0) {
            obj = this.siLandLoanMortgageList.filter(obj => (obj.khataNumber == siLandLoanMortgageModel.khataNumber) && (obj.surveyNumber == siLandLoanMortgageModel.surveyNumber)
              && (obj.villageId == siLandLoanMortgageModel.villageId)).map(object => {
                return object;
              });
          }
          if (obj.length > 0 && obj[0].rowId != this.surveyId) {
            this.landSurveyDuplicateDisable = true;
            this.siLandMortgageForm?.get("surveyNumber")?.reset();
            this.msgs = [];
            this.msgs = [{ severity: "error", detail: applicationConstants.SURVEY_NUMBER_ALREADY_EXIST }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
    
          } else {
            this.landSurveyDuplicateDisable = false;
          }
          this.surveyId = 0;
        }
    
      }

    deletDilogBox(rowData: any) {
        this.displayDialog = true; // Show the confirmation popup
        this.deleteId = rowData.id;
    }

    submitDeleteForGold() {
      this.deleteGoldLoanMortgage(this.deleteId)
      this.displayDialog = false; // Close the dialog after action
  }
    submitDeleteForLand() {
      this.deleteLandLoanMortgage(this.deleteId)
    this.displayDialog = false; // Close the dialog after action
}

  cancelForDialogBox() {
    this.displayDialog = false;
}

// deleteDialogBox(collateralType: string, rowData: any) {
//   this.displayDialog = true;  // Show popup
//   this.deleteId = rowData.id; // Store selected row ID
//   this.selectedCollateralType = collateralType; // Store collateral type
// }

// confirmDelete() {
//   this.deleteCollateral(this.selectedCollateralType, this.deleteId);
//   this.displayDialog = false; // Close the popup
// }

// deleteCollateral(collateralType: string, rowId: any) {
//   let deleteServiceMethod;

//   switch (collateralType) {
//       case 'GOLD_MORTGAGE':
//           deleteServiceMethod = this.siLoanMortagageDetailsService.deleteSIGoldLoanMortagageDetails(this.deleteId);
//           break;
//       case 'LAND_MORTGAGE':
//           deleteServiceMethod = this.siLoanMortagageDetailsService.deleteSILandLoanMortagageDetails(this.deleteId);
//           break;
//       case 'VEHICLE_MORTGAGE':
//           deleteServiceMethod = this.siLoanMortagageDetailsService.deleteSIVehicleLoanMortagageDetails(this.deleteId);
//           break;
//       default:
//           alert('Invalid Collateral Type');
//           return;
//   }

//   }
}
