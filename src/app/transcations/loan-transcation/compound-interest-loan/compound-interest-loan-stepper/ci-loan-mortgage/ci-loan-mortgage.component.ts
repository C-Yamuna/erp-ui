import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CiLoanMortgageService } from './shared/ci-loan-mortgage.service';
import { CiLoanApplicationService } from '../ci-product-details/shared/ci-loan-application.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { MembershipBasicDetails, MembershipGroupDetails, MemInstitutionDetails } from '../ci-membership-details/shared/membership-details.model';
import { CiLoanApplication } from '../ci-product-details/shared/ci-loan-application.model';
import { CiBondsMortgageLoan, CiGoldMortgageLoan, CiLandMortgageLoan, CiOthersMortgageLoan,CiPropertyMortgageLoan, CiStorageMortgageLoan, CiVehicleMortgageLoan } from './shared/ci-loan-mortgage.model';
import { DatePipe } from '@angular/common';
import { CompoundInterestProductDefinitionService } from '../../compound-interest-product-definition/shared/compound-interest-product-definition.service';
import { CollateralTypes, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { VillagesService } from 'src/app/transcations/term-deposits-transcation/shared/villages.service';

@Component({
  selector: 'app-ci-loan-mortgage',
  templateUrl: './ci-loan-mortgage.component.html',
  styleUrls: ['./ci-loan-mortgage.component.css']
})
export class CiLoanMortgageComponent {
  ciGoldMortgageForm: FormGroup;
  ciLandMortgageForm: FormGroup;
  ciBondMortgageForm: FormGroup;
  ciVehicleMortgageForm: FormGroup;
  ciStorageMortgageForm: FormGroup;
  ciOtherMortgageForm: FormGroup;
  propertyDetailsForm: FormGroup;
  suretyForm: FormGroup;

  selectCollateralType: any;
  collateraltypeOptionsList: any[] = [];

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

  membershipBasicDetailsModel: MembershipBasicDetails = new MembershipBasicDetails();
  membershipGroupDetailsModel: MembershipGroupDetails = new MembershipGroupDetails();
  membershipInstitutionDetailsModel: MemInstitutionDetails = new MemInstitutionDetails();

  ciLoanApplicationModel: CiLoanApplication = new CiLoanApplication;

  ciGoldMortgageLoanModel: CiGoldMortgageLoan = new CiGoldMortgageLoan();
  ciLandMortgageLoanModel: CiLandMortgageLoan = new CiLandMortgageLoan();
  ciBondsMortgageLoanModel: CiBondsMortgageLoan = new CiBondsMortgageLoan();
  ciVehicleMortgageLoanModel: CiVehicleMortgageLoan = new CiVehicleMortgageLoan();
  ciStorageMortgageLoanModel: CiStorageMortgageLoan = new CiStorageMortgageLoan();
  ciOthersMortgageLoanModel: CiOthersMortgageLoan = new CiOthersMortgageLoan();
  ciPropertyMortgageLoanModel: CiPropertyMortgageLoan = new CiPropertyMortgageLoan();
 

  memberTypeName: any;
  ciLoanApplicationId: any;
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
  ciGoldLoanMortgageList: any[] = [];
  ciLandLoanMortgageList: any[] = [];
  ciBondLoanMortgageList: any[] = [];
  ciVehicleLoanMortgageList: any[] = [];
  ciStorageLoanMortgageList: any[] = [];
  ciOtherLoanMortgageList: any[] = [];
  ciPropertyMortgageList: any[] = [];
  ciSuretyOrGuarantoMortgageList: any[] = [];
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
  ciProductName: any;
  accountNumber: any;
  requestedAmount: any;
  displayDialog: boolean = false;
  deleteId: any;

  constructor(private formBuilder: FormBuilder,
    private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService, private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private ciLoanMortgageService:CiLoanMortgageService,
    private ciLoanApplicationService: CiLoanApplicationService,private datePipe: DatePipe ,private ciProductDefinitionService: CompoundInterestProductDefinitionService, private villageService : VillagesService
  ) {

    this.ciGoldMortgageForm = this.formBuilder.group({
      'ornamentDescription':new FormControl('', [Validators.required]),
      'ornamentsCount': new FormControl('', [Validators.required, Validators.pattern(applicationConstants.ALLOW_NUMBERS)]),
      'ornamentQualityInKdm': new FormControl('', [Validators.required, Validators.pattern(applicationConstants.ALLOW_NUMBERS)]),
      'ornamentGrossWeightInGm': new FormControl('', [Validators.required,  Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS)]),
      'ornamentNetWeightInGm': new FormControl('', [Validators.required,  Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS)]),
      'valuePerGramInRs': new FormControl('', [Validators.required,  Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS)]),
      'ornamentNetValueInRs': new FormControl('', [Validators.required,  Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS)]),
    })

    this.ciLandMortgageForm = this.formBuilder.group({
     'passbookNumber': new FormControl('', [Validators.required]),
      'khataNumber': new FormControl('', [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
      'surveyNumber': new FormControl('', [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
      'totalLandInUnits': new FormControl('', [Validators.required,  Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS)]),
      'totalLandInSubUnits': new FormControl('', [Validators.required,  Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS)]),
      'landValuePerUnit': new FormControl('', [Validators.required,  Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS)]),   
      'totalLandValue': new FormControl('', [Validators.required,  Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS)]),
      'mortgageLandInUnits':new FormControl('', [Validators.required,  Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS)]),
      'mortgageLandInSubUnits': new FormControl('', [Validators.required,  Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS)]),
      'mortgageLandValuePerUnit': new FormControl(Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS),  Validators.minLength(1), Validators.maxLength(13)]),
      'totalMortgageLandValue': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS),  Validators.minLength(1), Validators.maxLength(13)]),
      'mortgageDeedNumber': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS)]),
      'mortgageDeedDate': new FormControl('', [Validators.required]),
      'ownershipType': new FormControl('', [Validators.required]),
      'village': new FormControl('', [Validators.required])
    })

    this.ciBondMortgageForm = this.formBuilder.group({
      'bondType': new FormControl('', [Validators.required]),
      'bondNumber': new FormControl(Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC), ]),
      'bondIssuedDate': new FormControl('', [Validators.required]),
      'bondIssuedBy': new FormControl(Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC), ]),
      'bondMaturityDate': new FormControl('', [Validators.required]),
      'bondMaturityValueInRs': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS)]),
      'bondPrincipleAmount': new FormControl('', [Validators.required]),
    })

    this.ciVehicleMortgageForm = this.formBuilder.group({
      'vehicleMakerOrBrand': new FormControl(Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
      'vehicleModel': new FormControl(Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
      'vehicleRegNumber': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
      'vehicleCost': new FormControl(Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS)]),
      'insuranceNumber': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
      'insuranceAmount': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS)]),
      'vehicleStatus': new FormControl('', [Validators.required]),
      'hypothecation': new FormControl('', [Validators.required]),
    })

    this.ciStorageMortgageForm = this.formBuilder.group({
    'commodity': new FormControl(Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
      'nwrStorageReceiptNumber': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
      'dateOfIssue': new FormControl('', [Validators.required]),
      'numberOfUnitsStored': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY)]),//present on hold
      'perUnitCostInRs': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS)]),
      'netValueInRs': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS)]),
    })

    this.ciOtherMortgageForm = this.formBuilder.group({
      'name': new FormControl('', [Validators.required]),
      'noOfUnits': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY)]),
      'value': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS)]),
      'remarks': new FormControl('')
    })

    this.propertyDetailsForm = this.formBuilder.group({
      'site': new FormControl('', [Validators.required]),
      'location': new FormControl('', [Validators.required]),
      'squareYards': new FormControl('', [Validators.required]),
      'propertySurveyNumber': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY)]),
      'valueOfProperty': new FormControl(Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS), Validators.minLength(1), Validators.maxLength(13)]),
      'nameOfProperty':new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
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
    // this.collateraltypeOptionsList = [
    //   { label: 'Gold', value: 1 },
    //   { label: 'Land', value: 2 },
    //   { label: 'Bond', value: 3 },
    //   { label: 'Vehicle', value: 4 },
    //   { label: 'Storage', value: 5 },
    //   { label: 'Property', value: 6 },
    //   { label: 'Other', value: 7 }
    //   // { label: 'Surety /Guarantor', value: 8 },
    //   // { label: 'Staff', value: 9 },
    //   // { label: 'Agreement', value: 10 },
    // ];

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
      { field: 'Village', header: 'Village' },
      { field: '*Passbook No	', header: '*Passbook No	' },
      { field: '*Khata Book No	', header: '*Khata Book No	' },
      { field: '*Survey No.	', header: '*Survey No.	' },
      { field: 'remarks', header: '*Total Land In Units	' },
      { field: 'remarks', header: '*Total Land In Sub Units' },
      { field: 'remarks', header: '*Land Value Per Unit' },
      { field: 'remarks', header: ' *Total Land Value	' },
      { field: 'remarks', header: '*Mortgage Land In Units	' },
      { field: 'remarks', header: '*Mortgage Land In SubUnits' },
      { field: 'remarks', header: '*Mortgage Land Value Per Unit	' },
      { field: 'remarks', header: '*Total Mortgage Land Value' },
      { field: 'remarks', header: ' *Mortgage Deed Number	' },
      { field: 'remarks', header: '*Mortgage Deed Date	' },
      { field: 'remarks', header: '*Land Ownership	' },
      { field: 'Action', header: 'ACTION' },

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
        this.ciLoanApplicationId = Number(queryParams);
        // this.isEdit = true;
        this.getCiLoanApplicationsById(this.ciLoanApplicationId);
      } else {
        this.isEdit = false;
      }
    });

    this.ciGoldMortgageForm.valueChanges.subscribe((data: any) => {
      this.updateData();
    });

    this.ciLandMortgageForm.valueChanges.subscribe((data: any) => {
      this.updateData();
    });

    this.ciBondMortgageForm.valueChanges.subscribe((data: any) => {
      this.updateData();
    });

    this.ciVehicleMortgageForm.valueChanges.subscribe((data: any) => {
      this.updateData();
    });

    this.ciStorageMortgageForm.valueChanges.subscribe((data: any) => {
      this.updateData();
    });

    this.ciOtherMortgageForm.valueChanges.subscribe((data: any) => {
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
      this.ciGoldMortgageLoanModel.collateralType = this.collateralType;
      this.ciLoanApplicationService.changeData({
        formValid: this.ciGoldMortgageForm.valid,
        data: this.ciGoldLoanMortgageList,
        isDisable:  !(this.ciGoldLoanMortgageList.length >0) ||  this.goldMortgagePopUp,
        stepperIndex: 7,
      });
    } else if (this.collateralType == CollateralTypes.LAND_MORTGAGE) {//land
      this.ciLandMortgageLoanModel.collateralType = this.collateralType;
      this.ciLandMortgageLoanModel.landTypeName = this.landTypeName;
      this.ciLoanApplicationService.changeData({
        formValid: !this.ciLandMortgageForm.valid ? true : false,
        data: this.ciLandMortgageLoanModel,
        isDisable:  !(this.ciLandLoanMortgageList.length >0)||  this.landMortgagePopUp,
        stepperIndex: 7,
      });
    } else if (this.collateralType == CollateralTypes.BONDS_MORTGAGE) {//bond
      this.ciBondsMortgageLoanModel.collateralType = this.collateralType;
      this.ciLoanApplicationService.changeData({
        formValid: !this.ciBondMortgageForm.valid ? true : false,
        data: this.ciBondsMortgageLoanModel,
        isDisable:  !(this.ciBondLoanMortgageList.length >0)||  this.bondMortgagePopUp,
        stepperIndex: 7,
      });
    } else if (this.collateralType == CollateralTypes.VEHICLE_MORTGAGE) {//vehicle

      this.ciVehicleMortgageLoanModel.collateralType = this.collateralType;
      this.ciLoanApplicationService.changeData({
        formValid: !this.ciVehicleMortgageForm.valid ? true : false,
        data: this.ciVehicleMortgageLoanModel,
        isDisable: !this.ciVehicleMortgageForm.valid, 
        stepperIndex: 7,
      });
    } else if (this.collateralType == CollateralTypes.STORAGE_MORTGAGE) {//storage
      this.ciStorageMortgageLoanModel.collateralType = this.collateralType;
      this.ciLoanApplicationService.changeData({
        formValid: !this.ciStorageMortgageForm.valid ? true : false,
        data: this.ciStorageMortgageLoanModel,
        isDisable:  !(this.ciStorageLoanMortgageList.length >0)||  this.storagePopUp,
        stepperIndex: 7,
      });
    }else if (this.collateralType == CollateralTypes.PROPERTY_MORTGAGE) {//property
      this.ciPropertyMortgageLoanModel.collateralType = this.collateralType;
      this.ciLoanApplicationService.changeData({
        formValid: !this.ciOtherMortgageForm.valid ? true : false,
        data: this.ciPropertyMortgageLoanModel,
        isDisable:  !(this.ciPropertyMortgageList.length >0)||  this.propertyPopUp,
        stepperIndex: 7,
      });
    } else if (this.collateralType == CollateralTypes.OTHER_MORTGAGE) {//other
      this.ciOthersMortgageLoanModel.collateralType = this.collateralType;
      this.ciLoanApplicationService.changeData({
        formValid: !this.ciOtherMortgageForm.valid ? true : false,
        data: this.ciOthersMortgageLoanModel,
        isDisable:  !(this.ciOtherLoanMortgageList.length >0)||  this.otherMortgagePopUp,
        stepperIndex: 7,
      });
    } else {
      this.ciLoanApplicationService.changeData({
        formValid: false,
        data: this.ciOthersMortgageLoanModel,
        isDisable: true,
        stepperIndex: 7,
      });
    }
  }
 
  /**
   * @implements get all villages
   * @author jyothi.naidana
   */
  getAllVaillages(){
    this.ciLoanMortgageService.getAllVillages().subscribe((data: any) => {
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
    this.ciLoanMortgageService.getAllLandTypes().subscribe(response => {
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
    this.ciLoanMortgageService.getAllLandTypes().subscribe(response => {
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
    this.ciLoanMortgageService.getAllLandownershipTypes().subscribe(response => {
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
   * @param ciLoanApplicationId 
   * @author jyothi.naidana
   */
  getCiLoanApplicationsById(ciLoanApplicationId: any) {
    this.commonFunctionsService
    this.ciLoanApplicationService.getLoanApplicationDetailsByLoanApplicationId(ciLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.ciLoanApplicationModel = this.responseModel.data[0];
                // strip date
                if(this.ciLoanApplicationModel.operationTypeName != null &&  this.ciLoanApplicationModel.operationTypeName != undefined &&  this.ciLoanApplicationModel.memberTypeName != MemberShipTypesData.INDIVIDUAL){
                  this.operationTypeName = applicationConstants.SINGLE_ACCOUNT_TYPE;
                }
                else if(this.ciLoanApplicationModel.operationTypeName != null &&  this.ciLoanApplicationModel.operationTypeName != undefined){
                  this.operationTypeName = this.ciLoanApplicationModel.operationTypeName;
                }
                if(this.ciLoanApplicationModel.ciProductName != null && this.ciLoanApplicationModel.ciProductName != undefined)
                  this.ciProductName = this.ciLoanApplicationModel.ciProductName;
                if(this.ciLoanApplicationModel.accountNumber != null && this.ciLoanApplicationModel.accountNumber != undefined)
                  this.accountNumber = this.ciLoanApplicationModel.accountNumber
                if(this.ciLoanApplicationModel.requestedAmount != null && this.ciLoanApplicationModel.requestedAmount != undefined)
                  this.requestedAmount =this.ciLoanApplicationModel.requestedAmount

                //collatral get based on collateral type
                this.getProductDefinitionByProductId(this.ciLoanApplicationModel.ciProductId);
                if (this.ciLoanApplicationModel.collateralType != undefined) {//gold
                  this.collateralType = this.ciLoanApplicationModel.collateralType;
                  if (this.ciLoanApplicationModel.collateralType == CollateralTypes.GOLD_MORTGAGE) {
                    this.showGoldform = true;
                    this.getCIGoldLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId ,false);
                  } else if (this.ciLoanApplicationModel.collateralType == CollateralTypes.LAND_MORTGAGE) {//land
                    this.showLandform = true;
                    this.getCILandLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId ,false);
                  } else if (this.ciLoanApplicationModel.collateralType == CollateralTypes.BONDS_MORTGAGE) {//bond
                    this.showBondform = true;
                    this.getCIBondLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId ,false);
                  } else if (this.ciLoanApplicationModel.collateralType == CollateralTypes.VEHICLE_MORTGAGE) {//vehicle
                    this.showVehicleform = true;
                    this.addButtonService = false;
                    this.getCIVehicleLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId , false);
                  } else if (this.ciLoanApplicationModel.collateralType == CollateralTypes.STORAGE_MORTGAGE) {//storage
                    this.showStorageform = true;
                    this.getCIStorageLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId,false) ;
                  } else if (this.ciLoanApplicationModel.collateralType == CollateralTypes.PROPERTY_MORTGAGE) {//property
                    this.showpropertyForm = true;
                    this.getCiLoanProperyDetailsByApplication(ciLoanApplicationId ,false);
                  }
                  else if (this.ciLoanApplicationModel.collateralType == CollateralTypes.OTHER_MORTGAGE) {//other
                    this.showOtherform = true;
                    this.getCIOtherLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId ,false);
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
   * @author jyothi.naidana
   */
   getProductDefinitionByProductId(id: any) {
    this.ciProductDefinitionService.getCompoundInterestProductDefinitionById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            if (this.responseModel.data[0].ciProdCollateralsConfigDTOList) {
              this.collateraltypeOptionsList = this.responseModel.data[0].ciProdCollateralsConfigDTOList
                .filter((item: any) => item != null && item.status === applicationConstants.ACTIVE)
                .map((item: { collateralTypeName: string, collateralType: any }) => ({
                  label: item.collateralTypeName,
                  value: item.collateralType
                }));
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
   * @author jyothi.naidana
   */
  onChange(event: any) {
    this.getFormBasedOnCollateralType(event);
    this.collateralType = event;
    this.updateCollateralInCiApplicationDetails();
  }

  /**
   * @implements form based collateral type
   * @param collateralType 
   * @author jyothi.naidana
   */
  getFormBasedOnCollateralType(collateralType: any) {

    //collatral models
   
    this.ciGoldMortgageLoanModel = new CiGoldMortgageLoan();
    this.ciLandMortgageLoanModel = new CiLandMortgageLoan();
    this.ciBondsMortgageLoanModel = new CiBondsMortgageLoan();
    this.ciVehicleMortgageLoanModel = new CiVehicleMortgageLoan();
    this.ciStorageMortgageLoanModel = new CiStorageMortgageLoan();
    this.ciPropertyMortgageLoanModel = new CiPropertyMortgageLoan();
    this.ciOthersMortgageLoanModel = new CiOthersMortgageLoan();

    this.isSameCollateral = false;

    //collatral type based form enable
    if (collateralType == CollateralTypes.GOLD_MORTGAGE) {//gold
      this.collateralType = collateralType;
      this.ciGoldMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
      this.ciGoldMortgageLoanModel.collateralType = this.collateralType;
      this.showGoldform = true;
      this.showLandform = false;
      this.showBondform = false;
      this.showVehicleform = false;
      this.showStorageform = false;
      this.showOtherform = false;
      this.showpropertyForm = false;
    } else if (collateralType== CollateralTypes.LAND_MORTGAGE) {//land
      this.collateralType = collateralType;
      this.ciLandMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
      this.ciLandMortgageLoanModel.collateralType = this.collateralType;
      this.showGoldform = false;
      this.showLandform = true;
      this.showBondform = false;
      this.showStorageform = false;
      this.showOtherform = false;
      this.showpropertyForm = false;
    } else if (collateralType == CollateralTypes.BONDS_MORTGAGE) {//bond
      this.collateralType = collateralType;
      this.ciBondsMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
      this.ciBondsMortgageLoanModel.collateralType = this.collateralType;
      this.showGoldform = false;
      this.showLandform = false;
      this.showBondform = true;
      this.showVehicleform = false;
      this.showStorageform = false;
      this.showOtherform = false;
      this.showpropertyForm = false;
    } else if (collateralType == CollateralTypes.VEHICLE_MORTGAGE) {//vehicle
      this.collateralType = collateralType;
      this.ciVehicleMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
      this.ciVehicleMortgageLoanModel.collateralType = this.collateralType;
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
      this.ciStorageMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
      this.ciStorageMortgageLoanModel.collateralType = this.collateralType;
      this.showGoldform = false;
      this.showLandform = false;
      this.showBondform = false;
      this.showVehicleform = false;
      this.showStorageform = true;
      this.showOtherform = false;
      this.showpropertyForm = false;
    } else if (collateralType == CollateralTypes.PROPERTY_MORTGAGE) {//property
      this.collateralType = collateralType;
      this.ciPropertyMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
      this.ciPropertyMortgageLoanModel.collateralType = this.collateralType;
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
   * @modification jyothi.naidana
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
   * @implements Get Gold Loan Mortgage detial by ciLoanApplicationId and AdmissionNumber
   * @param ciLoanApplicationId 
   * @param flag 
   * @modification jyothi.naidana
   */
  getCIGoldLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId: any , flag :Boolean) {
    this.ciLoanMortgageService.getCiGoldMortgageLoanDetailsByApplicationId(ciLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.ciGoldLoanMortgageList = this.responseModel.data;
            if (this.ciLoanApplicationModel.collateralType != null && this.ciLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.ciLoanApplicationModel.collateralType);
            this.ciLoanApplicationModel.collateralType = this.collateralType;
            this.updateData();
          }
        }
        else if(!flag){
          this.ciLoanApplicationModel.collateralType = null;
        }
      }
    });
  }

  /**
   * @implements Get Land Loan Mortgage detial by ciLoanApplicationId and AdmissionNumber
   * @param ciLoanApplicationId 
   * @param flag 
   * @modification jyothi.naidana
   */
  getCILandLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId: any ,flag :any) {
    this.ciLoanMortgageService.getCiLandMortgageLoanDetailsByApplicationId(ciLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.ciLandLoanMortgageList = this.responseModel.data.map((obj: any) => {
              if(obj.villageId != null && obj.villageId != undefined && this.villagesList != null && this.villagesList != undefined && this.villagesList.length >0){
                obj.villageName  = this.villagesList.find((village:any) => village.value == obj.villageId)?.label;
              }
              return obj;
            });
            if (this.ciLoanApplicationModel.collateralType != null && this.ciLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.ciLoanApplicationModel.collateralType);
            this.ciLoanApplicationModel.collateralType = this.collateralType;
            // this.updateData();
          }
        }
        else if(!flag){
          this.ciLoanApplicationModel.collateralType = null;
        }
        this.updateData();
      }
    });
  }


  /**
   * @implements Get BOnd Loan Mortgage detial by ciLoanApplicationId and AdmissionNumber
   * @param ciLoanApplicationId 
   * @param flag 
   * @author jyothi.naidana
   */
  getCIBondLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId: any , flag :Boolean) {
    this.commonFunctionsService
    this.ciLoanMortgageService.getCiBondMortgageLoanDetailsByApplicationId(ciLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.ciBondLoanMortgageList = this.responseModel.data.map((bond: any) => {
              bond.bondIssuedDateVal =  this.datePipe.transform(bond.bondIssuedDate, this.orgnizationSetting.datePipe);
              bond.bondMaturityDateVal =  this.datePipe.transform(bond.bondMaturityDate, this.orgnizationSetting.datePipe);
              let bondTypeName =  this.bondTypesList.filter((obj:any) => obj.value == bond.bondType);//bond type name
              if(bondTypeName != null && bondTypeName != undefined && bondTypeName.length >0)
                bond.bondTypeName = bondTypeName[0].label;
              return bond;
            }
          );
            if (this.ciLoanApplicationModel.collateralType != null && this.ciLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.ciLoanApplicationModel.collateralType);
            this.ciLoanApplicationModel.collateralType = this.collateralType;
            this.updateData();
          }
        }
        else if(!flag){
          this.ciLoanApplicationModel.collateralType = null;
          
        }
      }
    });
  }
  
  /**
   * @implements Get Vehicle Loan Mortgage detial by ciLoanApplicationId and AdmissionNumber
   * @param ciLoanApplicationId 
   * @param flag 
   * @modification jyothi.naidana
   */
  getCIVehicleLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId: any ,flag :boolean) {
    this.commonFunctionsService
    this.ciLoanMortgageService.getCiVehicleMortgageLoanDetailsByApplicationId(ciLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length >0) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.ciVehicleLoanMortgageList = this.responseModel.data;
            this.ciVehicleMortgageLoanModel = this.ciVehicleLoanMortgageList [0];
            this.addButtonService = true;
            if (this.ciLoanApplicationModel.collateralType != null && this.ciLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.ciLoanApplicationModel.collateralType);
            this.ciLoanApplicationModel.collateralType = this.collateralType;
            this.updateData();
          }
        }
        else if(!flag){
          this.ciLoanApplicationModel.collateralType = null;
          
        }
      }
    });
  }

  
  /**
   * @implements Get Storage Loan Mortgage detial by ciLoanApplicationId and AdmissionNumber
   * @param ciLoanApplicationId 
   * @param flag 
   * @modification jyothi.naidana
   */
  getCIStorageLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId: any , flag :Boolean) {
    this.commonFunctionsService
    this.ciLoanMortgageService.getCiStorageMortgageLoanDetailsByApplicationId(ciLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.ciStorageLoanMortgageList = this.responseModel.data.map((obj: any) => {
              if(obj.dateOfIssue != null && obj.dateOfIssue != undefined){
                obj.dateOfIssueVal = this.datePipe.transform(obj.dateOfIssue, this.orgnizationSetting.datePipe);
              }
              return obj;
            });

            if (this.ciLoanApplicationModel.collateralType != null && this.ciLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.ciLoanApplicationModel.collateralType);
            this.ciLoanApplicationModel.collateralType = this.collateralType;
            this.updateData();
          }
        }
        else if(!flag){
          this.ciLoanApplicationModel.collateralType = null;
         
        }
      }
    });
  }

 
   /**
   * @implements Get Other Loan Mortgage detial by ciLoanApplicationId and AdmissionNumber
   * @param ciLoanApplicationId 
   * @param flag 
   * @modification jyothi.naidana
   */
  getCIOtherLoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId: any , flag :Boolean) {
    this.commonFunctionsService
    this.ciLoanMortgageService.getCiOthersMortgageLoanDetailsByApplicationId(ciLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.ciOtherLoanMortgageList = this.responseModel.data;
            if (this.ciLoanApplicationModel.collateralType != null && this.ciLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.ciLoanApplicationModel.collateralType);
            this.ciLoanApplicationModel.collateralType = this.collateralType;
            this.updateData();
          }
        }
        else if(!flag){
          this.ciLoanApplicationModel.collateralType = null;
          // this.collateralType = null;
        }
      }
    });
  }

  /**
   * un-Used Function
   * @param ciLoanApplicationId 
   */
  getCILoanMortgageDetailsByciLoanApplicationId(ciLoanApplicationId: any) {
    this.ciLoanMortgageService.getCiBondMortgageLoanDetailsByApplicationId(ciLoanApplicationId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.ciGoldMortgageLoanModel = this.responseModel.data[0];
            this.ciLoanApplicationService.changeData({
              formValid: this.ciGoldMortgageForm.valid,
              data: this.ciGoldMortgageLoanModel,
              isDisable: (!this.ciGoldMortgageForm.valid),
              stepperIndex: 5,
            });
          }
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
   * @implements ci Loan Propery Details by Application Id
   * @param ciLoanApplicationId 
   * @author jyothi.naidana
   */
  getCiLoanProperyDetailsByApplication(ciLoanApplicationId: any, flag: Boolean) {
    this.commonFunctionsService
    this.ciPropertyMortgageList = [];
    this.ciLoanMortgageService.getCiProperyMortgageLoanDetailsByApplicationId(ciLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.ciPropertyMortgageList = this.responseModel.data;
            if (this.ciLoanApplicationModel.collateralType != null && this.ciLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.ciLoanApplicationModel.collateralType);
            this.ciLoanApplicationModel.collateralType = this.collateralType;
            this.updateData();
          }
        }
        else if (!flag) {
          this.ciLoanApplicationModel.collateralType = null;
          // this.collateralType = null;
        }
      }
    });

  }

  /**
   * @implements add gold loand mortgage
   * @Modification jyothi.naidana
   */
  addGoldLoanMortgage() {
    this.ciGoldMortgageForm.reset();
    this.ciGoldMortgageLoanModel = new CiGoldMortgageLoan();
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
   * @Modification jyothi.naidana
   */
  addLandLoanMortgage() {
    this.ciLandMortgageForm.reset();
    this.landMortgagePopUp = true;
    this.ciLandMortgageLoanModel = new CiLandMortgageLoan();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
  }


  /**
   * @implements add bond loan mortgage
   * @Modification jyothi.naidana
   */
  addBondLoanMortgage() {
    this.ciBondMortgageForm.reset();
    this.bondMortgagePopUp = true;
    this.ciBondsMortgageLoanModel = new CiBondsMortgageLoan();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
  }

  /**
   * @implements add vehicle
   * @modification jyothi.naidana
   */
  addVehicleLoanMortgage() {
    this.ciVehicleMortgageForm.reset();
    this.ciVehicleMortgageLoanModel = new CiVehicleMortgageLoan();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
  }

  /**
   * @implements add storage
   * @modification jyothi.naidana
   */
  addStorageLoanMortgage() {
    this.ciStorageMortgageForm.reset();
    this.ciStorageMortgageLoanModel = new CiStorageMortgageLoan();
    this.addButtonService = true;
    this.storagePopUp = true;
    this.editDeleteDisable = true;
    this.updateData();
  }

  /**
   * @implements add other loan mortgage
   * @modification jyothi.naidana
   */
  addOtherLoanMortgage() {
    this.ciOtherMortgageForm.reset();
    this.ciOthersMortgageLoanModel = new CiOthersMortgageLoan();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.otherMortgagePopUp = true;
    this.updateData();
  }

  /**
   * @implements save gold loand mortgage
   * @param row 
   * @modification jyothi.naidana
   */
  saveGoldLoanMortgage(row: any) {
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.goldMortgagePopUp = false;
    this.ciGoldMortgageLoanModel = row;
    this.ciGoldMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
    this.ciGoldMortgageLoanModel.admissionNo = this.ciLoanApplicationModel.admissionNo;
    // this.ciGoldMortgageLoanModel.status = applicationConstants.ACTIVE;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.ciLoanMortgageService.updateCiGoldMortgageLoanDetails(this.ciGoldMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciGoldMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCIGoldLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId ,false);
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
      this.ciLoanMortgageService.addCiGoldMortgageLoanDetails(this.ciGoldMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciGoldMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCIGoldLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId , false);
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
   * @modifiction jyothi.naidana
   */
  saveLandLoanMortgage(row: any) {
    this.landMortgagePopUp = false;
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.ciLandMortgageLoanModel = row;
    this.ciLandMortgageLoanModel.admissionNo = this.ciLoanApplicationModel.admissionNo;
    this.ciLandMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
    this.ciLandMortgageLoanModel.mortgageDeedDate = this.commonFunctionsService.getUTCEpoch(new Date(this.ciLandMortgageLoanModel.mortgageDeedDateVal));
    // this.ciLandMortgageLoanModel.status = applicationConstants.ACTIVE;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.ciLoanMortgageService.updateCiLandMortgageLoanDetails(this.ciLandMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciLandMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCILandLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId ,false);
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
      this.ciLoanMortgageService.addCiLandMortgageLoanDetails(this.ciLandMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciLandMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCILandLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId ,false);
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
   * @modification jyothi.naidana
   */
  saveBondLoanMortgage(row: any) {
    this.bondMortgagePopUp = false;//pop up
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.ciBondsMortgageLoanModel = row;
    this.ciBondsMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
    this.ciBondsMortgageLoanModel.admissionNo = this.ciLoanApplicationModel.admissionNo;
    this.ciBondsMortgageLoanModel.bondIssuedDate = this.commonFunctionsService.getUTCEpoch(new Date(row.bondIssuedDateVal));
    this.ciBondsMortgageLoanModel.bondMaturityDate = this.commonFunctionsService.getUTCEpoch(new Date(row.bondMaturityDateVal));
    // this.ciBondsMortgageLoanModel.status = applicationConstants.ACTIVE;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.ciLoanMortgageService.updateCiBondMortgageLoanDetails(this.ciBondsMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciBondsMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCIBondLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId ,false);
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
      this.ciLoanMortgageService.addCiBondMortgageLoanDetails(this.ciBondsMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciBondsMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCIBondLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId ,false);
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
   * @modification jyothi.naidana
   */
  saveVehicleLoanMortgage(row: any) {
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.ciVehicleMortgageLoanModel = row;
    this.ciVehicleMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
    this.ciVehicleMortgageLoanModel.admissionNo = this.ciLoanApplicationModel.admissionNo;
    // this.ciVehicleMortgageLoanModel.status = applicationConstants.ACTIVE;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.ciLoanMortgageService.updateCiVehicleMortgageLoanDetails(this.ciVehicleMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciVehicleMortgageLoanModel = this.responseModel.data[0];
              this.addButtonService = false;
              this.getCIVehicleLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId , false);
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
      this.ciLoanMortgageService.addCiVehicleMortgageLoanDetails(this.ciVehicleMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciVehicleMortgageLoanModel = this.responseModel.data[0];
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCIVehicleLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId , false);
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
   * @modification jyothi.naidana
   */
  saveStorageLoanMortgage(row: any) {
    this.storagePopUp = false;
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.ciStorageMortgageLoanModel = row;
    this.ciStorageMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
    this.ciStorageMortgageLoanModel.admissionNo = this.ciLoanApplicationModel.admissionNo;
    // this.ciStorageMortgageLoanModel.status = applicationConstants.ACTIVE;
    this.ciStorageMortgageLoanModel.dateOfIssue = this.commonFunctionsService.getUTCEpoch(new Date(this.ciStorageMortgageLoanModel.dateOfIssueVal));
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.ciLoanMortgageService.updateCiStorageMortgageLoanDetails(this.ciStorageMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciStorageMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCIStorageLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId , false);
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
      this.ciLoanMortgageService.addCiStorageMortgageLoanDetails(this.ciStorageMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciStorageMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCIStorageLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId ,false);
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
   * @author jyothi.naidana
   */
  saveOtherLoanMortgage(row: any) {
    this.otherMortgagePopUp = false;
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.ciOthersMortgageLoanModel = row;
    this.ciOthersMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
    // this.ciOthersMortgageLoanModel.admissionNo = this.ciLoanApplicationModel.admissionNo;
    // this.ciOthersMortgageLoanModel.status = applicationConstants.ACTIVE;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.ciLoanMortgageService.updateCiOthersMortgageLoanDetails(this.ciOthersMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciOthersMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCIOtherLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId ,false);
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
      this.ciLoanMortgageService.addCiOthersMortgageLoanDetails(this.ciOthersMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciOthersMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCIOtherLoanMortgageDetailsByciLoanApplicationId(this.responseModel.data[0].ciLoanApplicationId ,false);
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
   * @author jyothi.naidana
   */
  saveOrUpdateProperty(row:any){
    this.propertyPopUp = false;
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.ciOthersMortgageLoanModel = row;
    this.ciOthersMortgageLoanModel.ciLoanApplicationId = this.ciLoanApplicationId;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.ciLoanMortgageService.updateCiProperyMortgageLoanDetails(this.ciPropertyMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciOthersMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCiLoanProperyDetailsByApplication(this.responseModel.data[0].ciLoanApplicationId ,false);
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
      this.ciLoanMortgageService.addCiProperyMortgageLoanDetails(this.ciPropertyMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciOthersMortgageLoanModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getCiLoanProperyDetailsByApplication(this.responseModel.data[0].ciLoanApplicationId ,false);
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
   * @author jyothi.naidana
   */
  cancelGoldLoanMortgage() {
    this.ciGoldLoanMortgageList = [];
    this.goldMortgagePopUp = false;
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getCIGoldLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId ,false);
  }

  /**
   * @implements cancle land mortgage details
   * @author jyothi.naidana
   */
  cancelLandLoanMortgage() {
    this.landMortgagePopUp = false;
    this.ciLandLoanMortgageList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getCILandLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId ,false);
  }

  /**
   * @implements cancle bond 
   * @modification jyothi.naidana
   */
  cancelBondLoanMortgage() {
    this.bondMortgagePopUp = false;//pop up
    this.ciBondLoanMortgageList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getCIBondLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId ,false);
  }

  /**
   * @implements cancle vehicle loan
   * @modification jyothi.naidana
   */
  cancelVehicleLoanMortgage() {
    this.ciVehicleLoanMortgageList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getCIVehicleLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId , false);
  }

  /**
   * @implements cancle storage
   * @modification jyothi.naidana
   */
  cancelStorageLoanMortgage() {
    this.storagePopUp = false;
    this.ciStorageLoanMortgageList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getCIStorageLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId ,false);
  }

  /**
   * @implements cancle other loan mortgage
   * @modification jyothi.naidana
   */
  cancelOtherLoanMortgage() {
    this.otherMortgagePopUp = false;
    this.ciOtherLoanMortgageList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getCIOtherLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId ,false);
  }

  /**
   * @implements cancle property
   * @modification jyothi.naidana
   */
  propertyCancel(){
    this.ciPropertyMortgageList = [];
    this.propertyPopUp = false;
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getCiLoanProperyDetailsByApplication(this.ciLoanApplicationId ,false);
  }


   /**
   * @implements edin gold loan mortgage
   * @param rowData 
   * @author jyothi.naidana
   */
  editGoldLoanMortgage(rowData: any) {
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.goldMortgagePopUp = true;
    this.updateData();
    this.ciLoanMortgageService.getCiGoldMortgageLoanDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.ciGoldMortgageLoanModel = this.responseModel.data[0];
            
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
   * @author jyothi.naidana
   */
  editLandLoanMortgage(rowData: any) {
    this.landMortgagePopUp = true;
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.ciLoanMortgageService.getCiLandMortgageLoanDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.ciLandMortgageLoanModel = this.responseModel.data[0];
            this.ciLandMortgageLoanModel.mortgageDeedDateVal = this.datePipe.transform(this.ciLandMortgageLoanModel.mortgageDeedDate, this.orgnizationSetting.datePipe);

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
   * @author jyothi.naidana
   */
  editBondLoanMortgage(rowData: any) {
    this.bondMortgagePopUp = true;
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.ciLoanMortgageService.getCiBondMortgageLoanDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.ciBondsMortgageLoanModel = this.responseModel.data[0];
            this.ciBondsMortgageLoanModel.bondIssuedDateVal =  this.datePipe.transform(this.ciBondsMortgageLoanModel.bondIssuedDate, this.orgnizationSetting.datePipe);
            this. ciBondsMortgageLoanModel.bondMaturityDateVal =  this.datePipe.transform(this. ciBondsMortgageLoanModel.bondMaturityDate, this.orgnizationSetting.datePipe);
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
   * @modification jyothi.naidana
   */
  editVehicleLoanMortgage(rowData: any) {
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.ciLoanMortgageService.getCiVehicleMortgageLoanDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.ciVehicleMortgageLoanModel = this.responseModel.data[0];
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
   * @modifacation jyothi.naidana
   */
  editStorageLoanMortgage(rowData: any) {
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.storagePopUp = true;
    this.updateData();
    this.ciLoanMortgageService.getCiStorageMortgageLoanDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.ciStorageMortgageLoanModel = this.responseModel.data[0];
            this.ciStorageMortgageLoanModel.dateOfIssueVal = this.datePipe.transform(this.ciStorageMortgageLoanModel.dateOfIssue, this.orgnizationSetting.datePipe);
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
   * @modification jyothi.naidana
   */
  editOtherLoanMortgage(rowData: any) {
    this.otherMortgagePopUp = true;
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.ciLoanMortgageService.getCiOthersMortgageLoanDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.ciOthersMortgageLoanModel = this.responseModel.data[0];
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
   * @author jyothi.naidana
   */
  editProperty(rowData:any){
    this.propertyPopUp = true;
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.ciLoanMortgageService.getCiProperyMortgageLoanDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.ciPropertyMortgageLoanModel = this.responseModel.data[0];
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
   * @modifictaion jyothi.naidana
   */
  deleteGoldLoanMortgage(row: any) {
      this.deleteId = row.id;
      this.displayDialog = true;
  }

  /**
   * @implements delete land loan mortgage
   * @param row 
   * @modification jyothi.naidana
   */
  deleteLandLoanMortgage(row: any) {
    this.deleteId = row.id;
    this.displayDialog = true;
    
  }

  /**
   * @implements delete bond loan mortgagw
   * @param row 
   * @author jyothi.naidana
   */
  deleteBondLoanMortgage(row: any) {
    this.deleteId = row.id;
    this.displayDialog = true;
  }

  /**
   * @implements delete vihicle
   * @param row 
   * @author jyothi.naidana
   */
  deleteVehicleLoanMortgage(row: any) {
    this.ciLoanMortgageService.deleteCiVehicleMortgageLoanDetails(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.ciVehicleLoanMortgageList = this.responseModel.data;
        this.getCIVehicleLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId , false);
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
   * @modification jyothi.naidana
   */
  deleteStorageLoanMortgage(row: any) {
    this.deleteId = row.id;
    this.displayDialog = true;
  }

  /**
   * @implements delete other loan mortgage
   * @param row 
   * @author jyothi.naidana
   */
  deleteOtherLoanMortgage(row: any) {
    this.deleteId = row.id;
    this.displayDialog = true;
   
  }

  /**
   * @implements delete propert loan mortagage
   * @author jyothi.naidana
   * @param row 
   */
  deleteProperyLoanMortgage(row:any){
    this.deleteId = row.id;
    this.displayDialog = true;
   
  }


  /**
   * @implements update collateral in ci application Details
   * @author jyothi.naidana
   */
  updateCollateralInCiApplicationDetails() {
    this.ciLoanApplicationModel.collateralType = this.collateralType;
    this.ciLoanApplicationService.updateCiLoanApplications(this.ciLoanApplicationModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data.length > 0 && this.responseModel.data[0] != undefined && this.responseModel.data[0] != null) {
          if (this.responseModel.data[0].id != undefined && this.responseModel.data[0].id != null) {
            this.ciLoanApplicationModel = this.responseModel.data[0];
            this.ciLoanApplicationModel.collateralType = null; //to make collateral type in enable mode till atleast on record created
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
   * jyothi.naidana
   */
  addPropertyLoanMortgage(){
    this.propertyPopUp = true;
    this.ciPropertyMortgageLoanModel = new CiPropertyMortgageLoan();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    /**
     * for update validation
     */
    this.updateData();
  }

  /**
   * @implements delete confirmBox
   * @param collateralType 
   * @author jyothi.naidana
   */
  deleteCofirtmBox() {
    if (this.collateralType == CollateralTypes.GOLD_MORTGAGE) {//gold
      this.ciGoldLoanMortgageList = [];
      this.ciLoanMortgageService.deleteCiGoldMortgageLoanDetails(this.deleteId).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.getCIGoldLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId, false);
          this.msgs = [];
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          this.displayDialog = false;
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      });
    } else if (this.collateralType == CollateralTypes.LAND_MORTGAGE) {//land
      this.ciLandLoanMortgageList = [];
      this.ciLoanMortgageService.deleteCiLandMortgageLoanDetails(this.deleteId).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.getCILandLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId, false);
          this.msgs = [];
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          this.displayDialog = false;
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      });
    } else if (this.collateralType == CollateralTypes.BONDS_MORTGAGE) {//bond
      this.ciLoanMortgageService.deleteCiBondMortgageLoanDetails(this.deleteId).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.ciBondLoanMortgageList = this.responseModel.data;
          this.getCIBondLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId, false);
          this.msgs = [];
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          this.displayDialog = false;
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      });

    } else if (this.collateralType == CollateralTypes.VEHICLE_MORTGAGE) {//vehicle

    } else if (this.collateralType == CollateralTypes.STORAGE_MORTGAGE) {//storage
      this.ciLoanMortgageService.deleteCiStorageMortgageLoanDetails(this.deleteId).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.ciStorageLoanMortgageList = this.responseModel.data;
          this.getCIStorageLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId, false);
          this.msgs = [];
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          this.displayDialog = false;
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      });
    } else if (this.collateralType == CollateralTypes.PROPERTY_MORTGAGE) {//property
      this.ciLoanMortgageService.deleteCiProperyMortgageLoanDetails(this.deleteId).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.ciOtherLoanMortgageList = this.responseModel.data;
          this.getCiLoanProperyDetailsByApplication(this.ciLoanApplicationId, false);
          this.msgs = [];
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          this.displayDialog = false;
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      });
    }
    else if (this.collateralType == CollateralTypes.OTHER_MORTGAGE) {//other
      this.ciLoanMortgageService.deleteCiOthersMortgageLoanDetails(this.deleteId).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.ciOtherLoanMortgageList = this.responseModel.data;
          this.getCIOtherLoanMortgageDetailsByciLoanApplicationId(this.ciLoanApplicationId, false);
          this.msgs = [];
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          this.displayDialog = false;
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      });

    }
  }

  /**
   * @implements cancle for DialogBox
   * @author jyothi.naidana
   */
  cancelForDialogBox(){
    this.displayDialog = false;
  }
}
