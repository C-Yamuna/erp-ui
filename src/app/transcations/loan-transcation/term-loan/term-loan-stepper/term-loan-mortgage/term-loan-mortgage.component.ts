import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { TermApplication, TermLoanProductDefinition } from '../term-loan-application-details/shared/term-application.model';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../term-loan-new-membership/shared/term-loan-new-membership.model';
import { TermBondLoanMortgage, TermGoldLoanMortgage, TermLandLoanMortgage, TermOtherLoanMortgage, TermPropertyMortgageLoan, TermStorageLoanMortgage, TermVehicleLoanMortgage } from './shared/term-loan-mortgage.model';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { TermApplicationService } from '../term-loan-application-details/shared/term-application.service';
import { TermLoanMortgageService } from './shared/term-loan-mortgage.service';
import { CollateralTypes, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { DatePipe } from '@angular/common';
import { TermLoanInterestPolicyService } from '../../term-loan-product-definition/term-loan-product-definition-stepper/term-loan-interest-policy/shared/term-loan-interest-policy.service';
import { TermLoanProductDefinitionService } from '../../term-loan-product-definition/shared/term-loan-product-definition.service';

@Component({
  selector: 'app-term-loan-mortgage',
  templateUrl: './term-loan-mortgage.component.html',
  styleUrls: ['./term-loan-mortgage.component.css']
})
export class TermLoanMortgageComponent {
  termGoldMortgageForm: FormGroup;
  termLandMortgageForm: FormGroup;
  termBondMortgageForm: FormGroup;
  termVehicleMortgageForm: FormGroup;
  termStorageMortgageForm: FormGroup;
  termOtherMortgageForm: FormGroup;
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
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();

  termGoldLoanMortgageModel: TermGoldLoanMortgage = new TermGoldLoanMortgage();
  termLandLoanMortgageModel: TermLandLoanMortgage = new TermLandLoanMortgage();
  termBondLoanMortgageModel: TermBondLoanMortgage = new TermBondLoanMortgage();
  termVehicleLoanMortgageModel: TermVehicleLoanMortgage = new TermVehicleLoanMortgage();
  termStorageLoanMortgageModel: TermStorageLoanMortgage = new TermStorageLoanMortgage();
  termOtherLoanMortgageModel: TermOtherLoanMortgage = new TermOtherLoanMortgage();
  termLoanApplicationModel: TermApplication = new TermApplication();
  termPropertyMortgageLoanModel: TermPropertyMortgageLoan = new TermPropertyMortgageLoan();

  memberTypeName: any;
  termLoanApplicationId: any;
  isEdit: boolean = false;
  admissionNumber: any;

  termGoldMortgageLoanModelList: any[] = [];
  termLandMortgageLoanModelList: any[] = [];
  termBondsMortgageLoanModelList: any[] = [];
  termVehicleMortgageLoanModelList: any[] = [];
  termStorageMortgageLoanModelList: any[] = [];
  termOthersMortgageLoanModelList: any[] = [];

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
  termGoldLoanMortgageList: any[] = [];
  termLandLoanMortgageList: any[] = [];
  termBondLoanMortgageList: any[] = [];
  termVehicleLoanMortgageList: any[] = [];
  termStorageLoanMortgageList: any[] = [];
  termOtherLoanMortgageList: any[] = [];
  termPropertyMortgageList: any[] = [];
  termSuretyOrGuarantoMortgageList: any[] = [];
  bondTypesList:any[]=[];

  editDeleteDisable: boolean = false;
  landTypeName: any;

  termLoanPropertyList:any[]=[];
  termSurityMortgageList:any[]=[];
  termStaffList:any[]=[];
  termAgeementList:any[]=[];

  villagesList:any[]=[];
  landOwnershipTypesList:any[]=[];

  vehicleStatusList:any[]=[];

  showtermVehicleMortgageForm:boolean = false;
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
  termProductName: any;
  accountNumber: any;
  requestedAmount: any;
  constructor(private formBuilder: FormBuilder,
    private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService, private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private termLoanMortgageService: TermLoanMortgageService,
    private termLoanApplicationsService: TermApplicationService,private datePipe: DatePipe, private termLoanProductDefinitionService : TermLoanProductDefinitionService,
  ) {
    this.termGoldMortgageForm = this.formBuilder.group({
      'ornamentDescription': new FormControl('', [Validators.required]),
      'ornamentsCount': new FormControl('', Validators.compose([Validators.required])),
      'ornamentQualityInKdm': new FormControl('',  Validators.compose([Validators.required])),
      'ornamentGrossWeightInGm': new FormControl('',  Validators.compose([Validators.required])),
      'ornamentNetWeightInGm': new FormControl('',Validators.compose([Validators.required])),
      'valuePerGramInRs': new FormControl('',  Validators.compose([Validators.required])),
      'ornamentNetValueInRs': new FormControl('', Validators.compose([Validators.required])),
    })

    this.termLandMortgageForm = this.formBuilder.group({
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

    this.termBondMortgageForm = this.formBuilder.group({
      'bondType': new FormControl('', [Validators.required]),
      'bondNumber': new FormControl(Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC), ]),
      'bondIssuedDate': new FormControl('', [Validators.required]),
      'bondIssuedBy': new FormControl(Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC), ]),
      'bondMaturityDate': new FormControl('', [Validators.required]),
      'bondMaturityValueInRs': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_DECIMALS_UPTO_TWO_PLACES)]),
      'bondPrincipleAmount': new FormControl('', [Validators.required]),
    })

    this.termVehicleMortgageForm = this.formBuilder.group({
      'vehicleMakerOrBrand': new FormControl(Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
      'vehicleModel': new FormControl(Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
      'vehicleRegNumber': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
      'vehicleCost': new FormControl(Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_DECIMALS_UPTO_TWO_PLACES)]),
      'insuranceNumber': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
      'insuranceAmount': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_DECIMALS_UPTO_TWO_PLACES)]),
      'vehicleStatus': new FormControl('', [Validators.required]),
      'hypothecation': new FormControl('', [Validators.required]),
    })

    this.termStorageMortgageForm = this.formBuilder.group({
    'commodity': new FormControl(Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
      'nwrStorageReceiptNumber': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
      'dateOfIssue': new FormControl('', [Validators.required]),
      'numberOfUnitsStored': new FormControl('', [Validators.required]),//present on hold
      'perUnitCostInRs': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_DECIMALS_UPTO_TWO_PLACES)]),
      'netValueInRs': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_DECIMALS_UPTO_TWO_PLACES)]),
    })

    this.termOtherMortgageForm = this.formBuilder.group({
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
        this.termLoanApplicationId = Number(queryParams);
        // this.isEdit = true;
        this.getTermApplicationByTermAccId(this.termLoanApplicationId);
      } else {
        this.isEdit = false;
      }
    });

    this.termGoldMortgageForm.valueChanges.subscribe((data: any) => {
      this.updateData();
    });

    this.termLandMortgageForm.valueChanges.subscribe((data: any) => {
      this.updateData();
    });

    this.termBondMortgageForm.valueChanges.subscribe((data: any) => {
      this.updateData();
    });

    this.termVehicleMortgageForm.valueChanges.subscribe((data: any) => {
      this.updateData();
    });

    this.termStorageMortgageForm.valueChanges.subscribe((data: any) => {
      this.updateData();
    });

    this.termOtherMortgageForm.valueChanges.subscribe((data: any) => {
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
      this.termGoldLoanMortgageModel.collateralType = this.collateralType;
      this.termLoanApplicationsService.changeData({
        formValid: this.termGoldMortgageForm.valid,
        data: this.termGoldLoanMortgageList,
        isDisable:  !(this.termGoldLoanMortgageList.length >0) ||  this.goldMortgagePopUp,
        stepperIndex: 7,
      });
    } else if (this.collateralType == CollateralTypes.LAND_MORTGAGE) {//land
      this.termLandLoanMortgageModel.collateralType = this.collateralType;
      this.termLandLoanMortgageModel.landTypeName = this.landTypeName;
      this.termLoanApplicationsService.changeData({
        formValid: !this.termLandMortgageForm.valid ? true : false,
        data: this.termLandLoanMortgageModel,
        isDisable:  !(this.termLandLoanMortgageList.length >0)||  this.landMortgagePopUp,
        stepperIndex: 7,
      });
    } else if (this.collateralType == CollateralTypes.BONDS_MORTGAGE) {//bond
      this.termLandLoanMortgageModel.collateralType = this.collateralType;
      this.termLoanApplicationsService.changeData({
        formValid: !this.termBondMortgageForm.valid ? true : false,
        data: this.termLandLoanMortgageModel,
        isDisable:  !(this.termBondLoanMortgageList.length >0)||  this.bondMortgagePopUp,
        stepperIndex: 7,
      });
    } else if (this.collateralType == CollateralTypes.VEHICLE_MORTGAGE) {//vehicle

      this.termVehicleLoanMortgageModel.collateralType = this.collateralType;
      this.termLoanApplicationsService.changeData({
        formValid: !this.termVehicleMortgageForm.valid ? true : false,
        data: this.termVehicleLoanMortgageModel,
        isDisable: !this.termVehicleMortgageForm.valid, 
        stepperIndex: 7,
      });
    } else if (this.collateralType == CollateralTypes.STORAGE_MORTGAGE) {//storage
      this.termStorageLoanMortgageModel.collateralType = this.collateralType;
      this.termLoanApplicationsService.changeData({
        formValid: !this.termStorageMortgageForm.valid ? true : false,
        data: this.termStorageLoanMortgageModel,
        isDisable:  !(this.termStorageLoanMortgageList.length >0)||  this.storagePopUp,
        stepperIndex: 7,
      });
    }else if (this.collateralType == CollateralTypes.PROPERTY_MORTGAGE) {//property
      this.termPropertyMortgageLoanModel.collateralType = this.collateralType;
      this.termLoanApplicationsService.changeData({
        formValid: !this.termOtherMortgageForm.valid ? true : false,
        data: this.termPropertyMortgageLoanModel,
        isDisable:  !(this.termPropertyMortgageList.length >0)||  this.propertyPopUp,
        stepperIndex: 7,
      });
    } else if (this.collateralType == CollateralTypes.OTHER_MORTGAGE) {//other
      this.termOtherLoanMortgageModel.collateralType = this.collateralType;
      this.termLoanApplicationsService.changeData({
        formValid: !this.termOtherMortgageForm.valid ? true : false,
        data: this.termOtherLoanMortgageModel,
        isDisable:  !(this.termOtherLoanMortgageList.length >0)||  this.otherMortgagePopUp,
        stepperIndex: 7,
      });
    } else {
      this.termLoanApplicationsService.changeData({
        formValid: false,
        data: this.termOtherLoanMortgageModel,
        isDisable: true,
        stepperIndex: 7,
      });
    }
  }
 
  /**
   * @implements get all villages
  
   */
  getAllVaillages(){
    this.termLoanMortgageService.getAllVillages().subscribe((data: any) => {
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
    this.termLoanMortgageService.getAllLandTypes().subscribe(response => {
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
    this.termLoanMortgageService.getAllLandTypes().subscribe(response => {
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
    this.termLoanMortgageService.getAllLandownershipTypes().subscribe(response => {
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
   * @param termLoanApplicationId 
  
   */
  getTermApplicationByTermAccId(termLoanApplicationId: any) {
    this.commonFunctionsService
    this.termLoanApplicationsService.getTermApplicationByTermAccId(termLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.termLoanApplicationModel = this.responseModel.data[0];

                // strip date
                if(this.termLoanApplicationModel.operationTypeName != null &&  this.termLoanApplicationModel.operationTypeName != undefined &&  this.termLoanApplicationModel.memberTypeName != MemberShipTypesData.INDIVIDUAL){
                  this.operationTypeName = applicationConstants.SINGLE_ACCOUNT_TYPE;
                }
                else if(this.termLoanApplicationModel.operationTypeName != null &&  this.termLoanApplicationModel.operationTypeName != undefined){
                  this.operationTypeName = this.termLoanApplicationModel.operationTypeName;
                }
                if(this.termLoanApplicationModel.termProductName != null && this.termLoanApplicationModel.termProductName != undefined)
                  this.termProductName = this.termLoanApplicationModel.termProductName;
                if(this.termLoanApplicationModel.accountNumber != null && this.termLoanApplicationModel.accountNumber != undefined)
                  this.accountNumber = this.termLoanApplicationModel.accountNumber
                if(this.termLoanApplicationModel.requestedAmount != null && this.termLoanApplicationModel.requestedAmount != undefined)
                  this.requestedAmount =this.termLoanApplicationModel.requestedAmount

                //collatral get based on collateral type
                this.getProductDefinitionByProductId(this.termLoanApplicationModel.termProductId);
                if (this.termLoanApplicationModel.collateralType != undefined) {//gold
                  this.collateralType = this.termLoanApplicationModel.collateralType;
                  if (this.termLoanApplicationModel.collateralType == CollateralTypes.GOLD_MORTGAGE) {
                    this.showGoldform = true;
                    this.getTermGoldLoanMortgageDetailsByTermLoanApplicationId(termLoanApplicationId ,false);
                  } else if (this.termLoanApplicationModel.collateralType == CollateralTypes.LAND_MORTGAGE) {//land
                    this.showLandform = true;
                    this.getTermLandLoanMortgageDetailsByTermLoanApplicationId(termLoanApplicationId ,false);
                  } else if (this.termLoanApplicationModel.collateralType == CollateralTypes.BONDS_MORTGAGE) {//bond
                    this.showBondform = true;
                    this.getTermBondLoanMortgageDetailsByTermLoanApplicationId(termLoanApplicationId ,false);
                  } else if (this.termLoanApplicationModel.collateralType == CollateralTypes.VEHICLE_MORTGAGE) {//vehicle
                    this.showVehicleform = true;
                    this.addButtonService = false;
                    this.getTermVehicleLoanMortgageDetailsByTermLoanApplicationId(termLoanApplicationId , false);
                  } else if (this.termLoanApplicationModel.collateralType == CollateralTypes.STORAGE_MORTGAGE) {//storage
                    this.showStorageform = true;
                    this.getTermStorageLoanMortgageDetailsByTermLoanApplicationId(termLoanApplicationId,false) ;
                  } else if (this.termLoanApplicationModel.collateralType == CollateralTypes.PROPERTY_MORTGAGE) {//property
                    this.showpropertyForm = true;
                    this.getTermLoanProperyDetailsByApplication(termLoanApplicationId ,false);
                  }
                  else if (this.termLoanApplicationModel.collateralType == CollateralTypes.OTHER_MORTGAGE) {//other
                    this.showOtherform = true;
                    this.getTermOtherLoanMortgageDetailsByTermLoanApplicationId(termLoanApplicationId ,false);
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
  
   */
   getProductDefinitionByProductId(id: any) {
    this.termLoanProductDefinitionService.getTermLoanProductDefinitionById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            if (this.responseModel.data[0].termProdCollateralsConfigList) {
              // this.collateraltypeOptionsList = this.responseModel.data[0].termProdCollateralsConfigList
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
  
   */
  onChange(event: any) {
    this.getFormBasedOnCollateralType(event);
    this.collateralType = event;
    this.updateCollateralInTermApplicationDetails();
  }

  /**
   * @implements form based collateral type
   * @param collateralType 
  
   */
  getFormBasedOnCollateralType(collateralType: any) {

    //collatral models
    this.termGoldLoanMortgageModel  = new TermGoldLoanMortgage();
    this.termLandLoanMortgageModel = new TermLandLoanMortgage();
    this.termBondLoanMortgageModel = new TermBondLoanMortgage();
    this.termVehicleLoanMortgageModel  = new TermVehicleLoanMortgage();
    this.termStorageLoanMortgageModel = new TermStorageLoanMortgage();
    this.termOtherLoanMortgageModel = new TermOtherLoanMortgage();
    this.termPropertyMortgageLoanModel = new TermPropertyMortgageLoan();

    this.isSameCollateral = false;

    //collatral type based form enable
    if (collateralType == CollateralTypes.GOLD_MORTGAGE) {//gold
      this.collateralType = collateralType;
      this.termGoldLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
      this.termGoldLoanMortgageModel.collateralType = this.collateralType;
      this.showGoldform = true;
      this.showLandform = false;
      this.showBondform = false;
      this.showVehicleform = false;
      this.showStorageform = false;
      this.showOtherform = false;
      this.showpropertyForm = false;
    } else if (collateralType== CollateralTypes.LAND_MORTGAGE) {//land
      this.collateralType = collateralType;
      this.termLandLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
      this.termLandLoanMortgageModel.collateralType = this.collateralType;
      this.showGoldform = false;
      this.showLandform = true;
      this.showBondform = false;
      this.showStorageform = false;
      this.showOtherform = false;
      this.showpropertyForm = false;
    } else if (collateralType == CollateralTypes.BONDS_MORTGAGE) {//bond
      this.collateralType = collateralType;
      this.termBondLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
      this.termBondLoanMortgageModel.collateralType = this.collateralType;
      this.showGoldform = false;
      this.showLandform = false;
      this.showBondform = true;
      this.showVehicleform = false;
      this.showStorageform = false;
      this.showOtherform = false;
      this.showpropertyForm = false;
    } else if (collateralType == CollateralTypes.VEHICLE_MORTGAGE) {//vehicle
      this.collateralType = collateralType;
      this.termVehicleLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
      this.termVehicleLoanMortgageModel.collateralType = this.collateralType;
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
      this.termStorageLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
      this.termStorageLoanMortgageModel.collateralType = this.collateralType;
      this.showGoldform = false;
      this.showLandform = false;
      this.showBondform = false;
      this.showVehicleform = false;
      this.showStorageform = true;
      this.showOtherform = false;
      this.showpropertyForm = false;
    } else if (collateralType == CollateralTypes.PROPERTY_MORTGAGE) {//property
      this.collateralType = collateralType;
      this.termPropertyMortgageLoanModel.termLoanApplicationId = this.termLoanApplicationId;
      this.termPropertyMortgageLoanModel.collateralType = this.collateralType;
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
   * @implements Get Gold Loan Mortgage detial by termLoanApplicationId and AdmissionNumber
   * @param termLoanApplicationId 
   * @param flag 
   */
  getTermGoldLoanMortgageDetailsByTermLoanApplicationId(termLoanApplicationId: any , flag :Boolean) {
    this.termLoanMortgageService.getTermGoldLoanMortgageDetailsByLoanAccId(termLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.termGoldLoanMortgageList = this.responseModel.data;
            if (this.termLoanApplicationModel.collateralType != null && this.termLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.termLoanApplicationModel.collateralType);
            this.termLoanApplicationModel.collateralType = this.collateralType;
            this.updateData();
          }
        }
        else if(!flag){
          this.termLoanApplicationModel.collateralType = null;
        }
      }
    });
  }

  /**
   * @implements Get Land Loan Mortgage detial by TermLoanApplicationId and AdmissionNumber
   * @param termLoanApplicationId 
   * @param flag 
   */
  getTermLandLoanMortgageDetailsByTermLoanApplicationId(termLoanApplicationId: any ,flag :any) {
    this.termLoanMortgageService.getTermLandLoanMortgageDetailsByLoanAccId(termLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.termLandLoanMortgageList = this.responseModel.data.map((obj: any) => {
              if(obj.villageId != null && obj.villageId != undefined){
                let villageName  = this.villagesList.filter((village:any) => village.value == obj.villageId);
                obj.villageName = villageName[0].label;
              }
              return obj;
            });
            if (this.termLoanApplicationModel.collateralType != null && this.termLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.termLoanApplicationModel.collateralType);
            this.termLoanApplicationModel.collateralType = this.collateralType;
            // this.updateData();
          }
        }
        else if(!flag){
          this.termLoanApplicationModel.collateralType = null;
        }
        this.updateData();
      }
    });
  }


  /**
   * @implements Get BOnd Loan Mortgage detial by termLoanApplicationId and AdmissionNumber
   * @param termLoanApplicationId 
   * @param flag 
  
   */
  getTermBondLoanMortgageDetailsByTermLoanApplicationId(termLoanApplicationId: any , flag :Boolean) {
    this.commonFunctionsService
    this.termLoanMortgageService.getTermBondLoanMortgageDetailsByLoanAccId(termLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.termBondLoanMortgageList = this.responseModel.data.map((bond: any) => {
              bond.bondIssuedDateVal =  this.datePipe.transform(bond.bondIssuedDate, this.orgnizationSetting.datePipe);
              bond.bondMaturityDateVal =  this.datePipe.transform(bond.bondMaturityDate, this.orgnizationSetting.datePipe);
              let bondTypeName =  this.bondTypesList.filter((obj:any) => obj.value == bond.bondType);//bond type name
              if(bondTypeName != null && bondTypeName != undefined && bondTypeName.length >0)
                bond.bondTypeName = bondTypeName[0].label;
              return bond;
            }
          );
            if (this.termLoanApplicationModel.collateralType != null && this.termLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.termLoanApplicationModel.collateralType);
            this.termLoanApplicationModel.collateralType = this.collateralType;
            this.updateData();
          }
        }
        else if(!flag){
          this.termLoanApplicationModel.collateralType = null;
          
        }
      }
    });
  }
  
  /**
   * @implements Get Vehicle Loan Mortgage detial by termLoanApplicationId and AdmissionNumber
   * @param termLoanApplicationId 
   * @param flag 
   */
  getTermVehicleLoanMortgageDetailsByTermLoanApplicationId(termLoanApplicationId: any ,flag :boolean) {
    this.commonFunctionsService
    this.termLoanMortgageService.getTermVehicleLoanMortgageDetailsByLoanAccId(termLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length >0) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.termVehicleLoanMortgageList = this.responseModel.data;
            this.termVehicleLoanMortgageModel = this.termVehicleLoanMortgageList [0];
            this.addButtonService = true;
            if (this.termLoanApplicationModel.collateralType != null && this.termLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.termLoanApplicationModel.collateralType);
            this.termLoanApplicationModel.collateralType = this.collateralType;
            this.updateData();
          }
        }
        else if(!flag){
          this.termLoanApplicationModel.collateralType = null;
          
        }
      }
    });
  }

  
  /**
   * @implements Get Storage Loan Mortgage detial by termLoanApplicationId and AdmissionNumber
   * @param termLoanApplicationId 
   * @param flag 
   */
  getTermStorageLoanMortgageDetailsByTermLoanApplicationId(termLoanApplicationId: any , flag :Boolean) {
    this.commonFunctionsService
    this.termLoanMortgageService.getTermStorageLoanMortgageDetailsByLoanAccId(termLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.termStorageLoanMortgageList = this.responseModel.data.map((obj: any) => {
              if(obj.dateOfIssue != null && obj.dateOfIssue != undefined){
                obj.dateOfIssueVal = this.datePipe.transform(obj.dateOfIssue, this.orgnizationSetting.datePipe);
              }
              return obj;
            });

            if (this.termLoanApplicationModel.collateralType != null && this.termLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.termLoanApplicationModel.collateralType);
            this.termLoanApplicationModel.collateralType = this.collateralType;
            this.updateData();
          }
        }
        else if(!flag){
          this.termLoanApplicationModel.collateralType = null;
         
        }
      }
    });
  }

 
   /**
   * @implements Get Other Loan Mortgage detial by termLoanApplicationId and AdmissionNumber
   * @param termLoanApplicationId 
   * @param flag 
   */
   getTermOtherLoanMortgageDetailsByTermLoanApplicationId(termLoanApplicationId: any , flag :Boolean) {
    this.commonFunctionsService
    this.termLoanMortgageService.getTermOtherLoanMortgageDetailsByLoanAccId(termLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.termOtherLoanMortgageList = this.responseModel.data;
            if (this.termLoanApplicationModel.collateralType != null && this.termLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.termLoanApplicationModel.collateralType);
            this.termLoanApplicationModel.collateralType = this.collateralType;
            this.updateData();
          }
        }
        else if(!flag){
          this.termLoanApplicationModel.collateralType = null;
          // this.collateralType = null;
        }
      }
    });
  }

  /**
   * un-Used Function
   * @param termLoanApplicationId 
   */
  getTermLoanMortgageDetailsByTermLoanApplicationId(termLoanApplicationId: any) {
    this.termLoanMortgageService.getTermBondLoanMortgageDetailsByLoanAccId(termLoanApplicationId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.termGoldLoanMortgageModel = this.responseModel.data[0];
            this.termLoanApplicationsService.changeData({
              formValid: this.termGoldMortgageForm.valid,
              data: this.termGoldLoanMortgageModel,
              isDisable: (!this.termGoldMortgageForm.valid),
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
   * @implements term Loan Propery Details by Application Id
   * @param termLoanApplicationId 
  
   */
  getTermLoanProperyDetailsByApplication(termLoanApplicationId: any, flag: Boolean) {
    this.commonFunctionsService
    this.termPropertyMortgageList = [];
    this.termLoanMortgageService.getTermProperyMortgageLoanDetailsByApplicationId(termLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.isEdit = true;
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.termPropertyMortgageList = this.responseModel.data;
            if (this.termLoanApplicationModel.collateralType != null && this.termLoanApplicationModel.collateralType != undefined)
              this.getEditFormBasedOnCollateralType(this.termLoanApplicationModel.collateralType);
            this.termLoanApplicationModel.collateralType = this.collateralType;
            this.updateData();
          }
        }
        else if (!flag) {
          this.termLoanApplicationModel.collateralType = null;
          // this.collateralType = null;
        }
      }
    });

  }

  /**
   * @implements add gold loand mortgage

   */
  addGoldLoanMortgage() {
    this.termGoldLoanMortgageModel = new TermGoldLoanMortgage();
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
   */
  addLandLoanMortgage() {
    this.landMortgagePopUp = true;
    this.termLandLoanMortgageModel = new TermLandLoanMortgage();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
  }


  /**
   * @implements add bond loan mortgage
   */
  addBondLoanMortgage() {
    this.bondMortgagePopUp = true;
    this.termBondLoanMortgageModel = new TermBondLoanMortgage();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
  }

  /**
   * @implements add vehicle
   */
  addVehicleLoanMortgage() {
    this.termVehicleLoanMortgageModel = new TermVehicleLoanMortgage();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
  }

  /**
   * @implements add storage
   */
  addStorageLoanMortgage() {
    this.termStorageLoanMortgageModel = new TermStorageLoanMortgage();
    this.addButtonService = true;
    this.storagePopUp = true;
    this.editDeleteDisable = true;
    this.updateData();
  }

  /**
   * @implements add other loan mortgage
   */
  addOtherLoanMortgage() {
    this.termOtherLoanMortgageModel = new TermOtherLoanMortgage();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.otherMortgagePopUp = true;
    this.updateData();
  }

  /**
   * @implements save gold loand mortgage
   * @param row 
   */
  saveGoldLoanMortgage(row: any) {
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.goldMortgagePopUp = false;
    this.termGoldLoanMortgageModel = row;
    this.termGoldLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
    this.termGoldLoanMortgageModel.admissionNo = this.termLoanApplicationModel.admissionNo;
    // this.termGoldLoanMortgageModel.status = applicationConstants.ACTIVE;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.termLoanMortgageService.updateTermGoldLoanMortagageDetails(this.termGoldLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termGoldLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                this.getTermGoldLoanMortgageDetailsByTermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId ,false);
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
      this.termLoanMortgageService.addTermGoldLoanMortagageDetails(this.termGoldLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termGoldLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                this.getTermGoldLoanMortgageDetailsByTermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId , false);
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
   */
  saveLandLoanMortgage(row: any) {
    this.landMortgagePopUp = false;
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.termLandLoanMortgageModel = row;
    this.termLandLoanMortgageModel.admissionNo = this.termLoanApplicationModel.admissionNo;
    this.termLandLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
    this.termLandLoanMortgageModel.mortgageDeedDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termLandLoanMortgageModel.mortgageDeedDateVal));
    // this.termLandLoanMortgageModel.status = applicationConstants.ACTIVE;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.termLoanMortgageService.updateTermLandLoanMortagageDetails(this.termLandLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termLandLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                this.getTermLandLoanMortgageDetailsByTermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId ,false);
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
      this.termLoanMortgageService.addTermLandLoanMortagageDetails(this.termLandLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termLandLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                this.getTermLandLoanMortgageDetailsByTermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId ,false);
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
\\\
   */
  saveBondLoanMortgage(row: any) {
    this.bondMortgagePopUp = false;//pop up
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.termBondLoanMortgageModel = row;
    this.termBondLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
    this.termBondLoanMortgageModel.admissionNo = this.termLoanApplicationModel.admissionNo;
    this.termBondLoanMortgageModel.bondIssuedDate = this.commonFunctionsService.getUTCEpoch(new Date(row.bondIssuedDateVal));
    this.termBondLoanMortgageModel.bondMaturityDate = this.commonFunctionsService.getUTCEpoch(new Date(row.bondMaturityDateVal));
    // this.termBondLoanMortgageModel.status = applicationConstants.ACTIVE;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.termLoanMortgageService.updateTermBondLoanMortagageDetails(this.termBondLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termBondLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                this.getTermBondLoanMortgageDetailsByTermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId ,false);
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
      this.termLoanMortgageService.addTermBondLoanMortagageDetails(this.termBondLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termBondLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                this.getTermBondLoanMortgageDetailsByTermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId ,false);
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
   */
  saveVehicleLoanMortgage(row: any) {
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.termVehicleLoanMortgageModel = row;
    this.termVehicleLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
    this.termVehicleLoanMortgageModel.admissionNo = this.termLoanApplicationModel.admissionNo;
    // this.termVehicleLoanMortgageModel.status = applicationConstants.ACTIVE;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.termLoanMortgageService.updateTermVehicleLoanMortagageDetails(this.termVehicleLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termVehicleLoanMortgageModel = this.responseModel.data[0];
              this.addButtonService = false;
              this.getTermVehicleLoanMortgageDetailsByTermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId , false);
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
      this.termLoanMortgageService.addTermVehicleLoanMortagageDetails(this.termVehicleLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termVehicleLoanMortgageModel = this.responseModel.data[0];
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                this.getTermVehicleLoanMortgageDetailsByTermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId , false);
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
   */
  saveStorageLoanMortgage(row: any) {
    this.storagePopUp = false;
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.termStorageLoanMortgageModel = row;
    this.termStorageLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
    this.termStorageLoanMortgageModel.admissionNo = this.termLoanApplicationModel.admissionNo;
    // this.termStorageLoanMortgageModel.status = applicationConstants.ACTIVE;
    this.termStorageLoanMortgageModel.dateOfIssue = this.commonFunctionsService.getUTCEpoch(new Date(this.termStorageLoanMortgageModel.dateOfIssueVal));
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.termLoanMortgageService.updateTermStorageLoanMortagageDetails(this.termStorageLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termStorageLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                this.getTermStorageLoanMortgageDetailsByTermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId , false);
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
      this.termLoanMortgageService.addTermStorageLoanMortagageDetails(this.termStorageLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termStorageLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                this.getTermStorageLoanMortgageDetailsByTermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId ,false);
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
  
   */
  saveOtherLoanMortgage(row: any) {
    this.otherMortgagePopUp = false;
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.termOtherLoanMortgageModel = row;
    this.termOtherLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
    // this.termOtherLoanMortgageModel.admissionNo = this.termLoanApplicationModel.admissionNo;
    // this.termOtherLoanMortgageModel.status = applicationConstants.ACTIVE;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.termLoanMortgageService.updateTermOtherLoanMortagageDetails(this.termOtherLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termOtherLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                this.getTermOtherLoanMortgageDetailsByTermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId ,false);
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
      this.termLoanMortgageService.addTermOtherLoanMortagageDetails(this.termOtherLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termOtherLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                this.getTermOtherLoanMortgageDetailsByTermLoanApplicationId(this.responseModel.data[0].termLoanApplicationId ,false);
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
  
   */
  saveOrUpdateProperty(row:any){
    this.propertyPopUp = false;
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.termOtherLoanMortgageModel = row;
    this.termOtherLoanMortgageModel.termLoanApplicationId = this.termLoanApplicationId;
    this.updateData();
    if (row.id != null && row.id != undefined) {
      this.termLoanMortgageService.updateTermProperyMortgageLoanDetails(this.termPropertyMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termOtherLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                this.getTermLoanProperyDetailsByApplication(this.responseModel.data[0].termLoanApplicationId ,false);
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
      this.termLoanMortgageService.addTermProperyMortgageLoanDetails(this.termPropertyMortgageLoanModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termOtherLoanMortgageModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                this.getTermLoanProperyDetailsByApplication(this.responseModel.data[0].termLoanApplicationId ,false);
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
  
   */
  cancelGoldLoanMortgage() {
    this.termGoldLoanMortgageList = [];
    this.goldMortgagePopUp = false;
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getTermGoldLoanMortgageDetailsByTermLoanApplicationId(this.termLoanApplicationId ,false);
  }

  /**
   * @implements cancle land mortgage details
  
   */
  cancelLandLoanMortgage() {
    this.landMortgagePopUp = false;
    this.termLandLoanMortgageList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getTermLandLoanMortgageDetailsByTermLoanApplicationId(this.termLoanApplicationId ,false);
  }

  /**
   * @implements cancle bond 
   */
  cancelBondLoanMortgage() {
    this.bondMortgagePopUp = false;//pop up
    this.termBondLoanMortgageList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getTermBondLoanMortgageDetailsByTermLoanApplicationId(this.termLoanApplicationId ,false);
  }

  /**
   * @implements cancle vehicle loan
   */
  cancelVehicleLoanMortgage() {
    this.termVehicleLoanMortgageList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getTermVehicleLoanMortgageDetailsByTermLoanApplicationId(this.termLoanApplicationId , false);
  }

  /**
   * @implements cancle storage
   */
  cancelStorageLoanMortgage() {
    this.storagePopUp = false;
    this.termStorageLoanMortgageList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getTermStorageLoanMortgageDetailsByTermLoanApplicationId(this.termLoanApplicationId ,false);
  }

  /**
   * @implements cancle other loan mortgage
   */
  cancelOtherLoanMortgage() {
    this.otherMortgagePopUp = false;
    this.termOtherLoanMortgageList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getTermOtherLoanMortgageDetailsByTermLoanApplicationId(this.termLoanApplicationId ,false);
  }

  /**
   * @implements cancle property
   */
  propertyCancel(){
    this.termPropertyMortgageList = [];
    this.propertyPopUp = false;
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getTermLoanProperyDetailsByApplication(this.termLoanApplicationId ,false);
  }


   /**
   * @implements edin gold loan mortgage
   * @param rowData 
  
   */
  editGoldLoanMortgage(rowData: any) {
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.goldMortgagePopUp = true;
    this.updateData();
    this.termLoanMortgageService.getTermGoldLoanMortagageDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.termGoldLoanMortgageModel = this.responseModel.data[0];
            
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
  
   */
  editLandLoanMortgage(rowData: any) {
    this.landMortgagePopUp = true;
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.termLoanMortgageService.getTermLandLoanMortagageDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.termLandLoanMortgageModel = this.responseModel.data[0];
            this.termLandLoanMortgageModel.mortgageDeedDateVal = this.datePipe.transform(this.termLandLoanMortgageModel.mortgageDeedDate, this.orgnizationSetting.datePipe);

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
  
   */
  editBondLoanMortgage(rowData: any) {
    this.bondMortgagePopUp = true;
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.termLoanMortgageService.getTermBondLoanMortagageDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.termBondLoanMortgageModel = this.responseModel.data[0];
            this.termBondLoanMortgageModel.bondIssuedDateVal =  this.datePipe.transform(this.termBondLoanMortgageModel.bondIssuedDate, this.orgnizationSetting.datePipe);
            this. termBondLoanMortgageModel.bondMaturityDateVal =  this.datePipe.transform(this. termBondLoanMortgageModel.bondMaturityDate, this.orgnizationSetting.datePipe);
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
   */
  editVehicleLoanMortgage(rowData: any) {
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.termLoanMortgageService.getTermVehicleLoanMortagageDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.termVehicleLoanMortgageModel = this.responseModel.data[0];
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
   */
  editStorageLoanMortgage(rowData: any) {
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.storagePopUp = true;
    this.updateData();
    this.termLoanMortgageService.getTermStorageLoanMortagageDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.termStorageLoanMortgageModel = this.responseModel.data[0];
            this.termStorageLoanMortgageModel.dateOfIssueVal = this.datePipe.transform(this.termStorageLoanMortgageModel.dateOfIssue, this.orgnizationSetting.datePipe);
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
   */
  editOtherLoanMortgage(rowData: any) {
    this.otherMortgagePopUp = true;
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.termLoanMortgageService.getTermOtherLoanMortagageDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.termOtherLoanMortgageModel = this.responseModel.data[0];
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
  
   */
  editProperty(rowData:any){
    this.propertyPopUp = true;
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.termLoanMortgageService.getTermProperyMortgageLoanDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.termPropertyMortgageLoanModel = this.responseModel.data[0];
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
   */
  deleteGoldLoanMortgage(row: any) {
    this.termGoldLoanMortgageList = [];
    this.termLoanMortgageService.deleteTermGoldLoanMortagageDetails(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.getTermGoldLoanMortgageDetailsByTermLoanApplicationId(this.termLoanApplicationId ,false);
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
   */
  deleteLandLoanMortgage(row: any) {
    this.termLandLoanMortgageList = [];
    this.termLoanMortgageService.deleteTermLandLoanMortagageDetails(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.getTermLandLoanMortgageDetailsByTermLoanApplicationId(this.termLoanApplicationId ,false);
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
  
   */
  deleteBondLoanMortgage(row: any) {
    this.termLoanMortgageService.deleteTermBondLoanMortagageDetails(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.termBondLoanMortgageList = this.responseModel.data;
        this.getTermBondLoanMortgageDetailsByTermLoanApplicationId(this.termLoanApplicationId ,false);
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
  
   */
  deleteVehicleLoanMortgage(row: any) {
    this.termLoanMortgageService.deleteTermVehicleLoanMortagageDetails(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.termVehicleLoanMortgageList = this.responseModel.data;
        this.getTermVehicleLoanMortgageDetailsByTermLoanApplicationId(this.termLoanApplicationId , false);
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
   */
  deleteStorageLoanMortgage(row: any) {
    this.termLoanMortgageService.deleteTermStorageLoanMortagageDetails(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.termStorageLoanMortgageList = this.responseModel.data;
        this.getTermStorageLoanMortgageDetailsByTermLoanApplicationId(this.termLoanApplicationId ,false);
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
  
   */
  deleteOtherLoanMortgage(row: any) {
    this.termLoanMortgageService.deleteTermOtherLoanMortagageDetails(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.termOtherLoanMortgageList = this.responseModel.data;
        this.getTermOtherLoanMortgageDetailsByTermLoanApplicationId(this.termLoanApplicationId ,false);
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
  
   * @param row 
   */
  deleteProperyLoanMortgage(row:any){
    this.termLoanMortgageService.deleteTermProperyMortgageLoanDetails(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.termOtherLoanMortgageList = this.responseModel.data;
        this.getTermLoanProperyDetailsByApplication(this.termLoanApplicationId ,false);
        this.msgs = [];
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
      }
    });
  }


  /**
   * @implements update collateral in Term application Details
  
   */
  updateCollateralInTermApplicationDetails() {
    this.termLoanApplicationModel.collateralType = this.collateralType;
    this.termLoanApplicationsService.updateTermApplication(this.termLoanApplicationModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data.length > 0 && this.responseModel.data[0] != undefined && this.responseModel.data[0] != null) {
          if (this.responseModel.data[0].id != undefined && this.responseModel.data[0].id != null) {
            this.termLoanApplicationModel = this.responseModel.data[0];
            this.termLoanApplicationModel.collateralType = null; //to make collateral type in enable mode till atleast on record created
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
 
   */
  addPropertyLoanMortgage(){
    this.propertyPopUp = true;
    this.termPropertyMortgageLoanModel = new TermPropertyMortgageLoan();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    /**
     * for update validation
     */
    this.updateData();
  }
}
