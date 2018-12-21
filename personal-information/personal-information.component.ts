import { Component, OnInit , NgModule,Inject} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators,FormControl,FormArray } from '@angular/forms';
import { SignupService } from '../../services/signup/signup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { AlertService } from '../../services/alert/alert.service';
import { MyprofileService } from '../../services/myprofile/myprofile.service';
import { interval } from 'rxjs';
import {BrowserModule} from '@angular/platform-browser'
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { Product, SellingPoint } from '../../product'
import { ToastrService } from 'ngx-toastr';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';



@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.css']
})
export class PersonalInformationComponent implements OnInit {

	form:any;

	isTrue = false;
	currentuser: any;
	submitted = false;
	submitted1 = false;
	submitted2 = false;
	is_bank_submitted = false;
	userData : any;
	//PERSONAL INFORMATION
	personalInfoForm : FormGroup;
	

	Islogin = false;
	unamePattern = '^[-\sa-zA-Z\s-]+$';
	onlynumberPattern = '^[0-9]\d*$';
	pwdPattern = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,12}$";
	mobnumPattern = "^((\\+91-?)|0)?[0-9]{10}$"; 
	emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
	onlyletterPattern = "/[^a-zA-Z]/g";
	bankIFSCPattern = '^[A-Za-z]{4}[a-zA-Z0-9]{7}$';
	onlytwoletterPattern = '/^[a-z]{2}$/i';

	personalInfoResponse : any;
	selectedFile : any;
	FOLDER : string;
	filename:any;
	sameMobile : boolean = false;
	userid : number;
	loggedInUser : any;
	is_v_tc : boolean = false;
	is_b_tc : boolean = false;
	isLoaderAvailable : boolean = false;
	is_personal_tc : boolean = false;

	//for camera
	public showWebcam = true;
  	public allowCameraSwitch = true;
  	public multipleWebcamsAvailable = false;
	  public deviceId: string;
	  public videoOptions: MediaTrackConstraints = {
		// width: {ideal: 1024},
		// height: {ideal: 576}
	  };
	  public errors: WebcamInitError[] = [];
	
	  // latest snapshot
	  public webcamImage: WebcamImage = null;
	
	  // webcam snapshot trigger
	  private trigger: Subject<void> = new Subject<void>();
	  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
	  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
	
	
	  public triggerSnapshot(): void {
		this.trigger.next();
	  }
	
	  public toggleWebcam(): void {
		this.showWebcam = !this.showWebcam;
	  }
	
	  public handleInitError(error: WebcamInitError): void {
		this.errors.push(error);
	  }
	
	  public showNextWebcam(directionOrDeviceId: boolean|string): void {
		// true => move forward through devices
		// false => move backwards through devices
		// string => move to device with given deviceId
		this.nextWebcam.next(directionOrDeviceId);
	  }
	
	  public handleImage(webcamImage: WebcamImage): void {
		console.info('received webcam image', webcamImage);
		this.webcamImage = webcamImage;
	  }
	
	  public cameraWasSwitched(deviceId: string): void {
		console.log('active device: ' + deviceId);
		this.deviceId = deviceId;
	  }
	
	  public get triggerObservable(): Observable<void> {
		return this.trigger.asObservable();
	  }
	
	  public get nextWebcamObservable(): Observable<boolean|string> {
		return this.nextWebcam.asObservable();
	  }

	  
	
	// VEHICLE INFORMATION
	
	//BUISNESS INFORMATION
	businessInfoResponse : any;

	constructor(private formBuilder : FormBuilder,public SignupService : SignupService, private route:ActivatedRoute,private router:Router,private authenticationService : AuthenticationService,private alertService : AlertService,private myprofileService : MyprofileService,private toastr: ToastrService) { 
	
	
	
	}

	ngOnInit() {

		//for camera
		WebcamUtil.getAvailableVideoInputs()
		  .then((mediaDevices: MediaDeviceInfo[]) => {
			this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
		  });

		// console.log('In my profile componenet');
		this.currentuser = localStorage.getItem('constantVariable.currentUser')
		// console.log(JSON.parse(this.currentuser));
		if(this.currentuser)
		{
			// console.log('user is logged in to dashboard');
			this.loggedInUser = JSON.parse(this.currentuser);
			this.userid = this.loggedInUser.response.id;

			// get current user detail by his id
			
			
			this.myprofileService.getPersonalInfo(this.userid)
            .pipe(first())
            .subscribe(
                data => {
                	this.userData = data;
                	console.log('user logged in data');
                	console.log(this.userData);
                	console.log('user result');
                	console.log(this.userData.response.Users);
                	
                	this.personalInfoForm.patchValue(this.userData.response.Users);
               //  	if(this.personalInfoResponse.response.status == 'success'){
               //  		 this.alertService.success('Personal information saved successful', true);
	            		// this.router.navigate(['/myprofile']);
               //  	}
                },
                error => {
                	console.log('error');
                	// this.alertService.error('Something went wrong.');
                	// this.alertService.error(error);
                });
			
		}

		//*********** Personal Information **********************//

		this.personalInfoForm = this.formBuilder.group({
	        op_first_name: ['', [ Validators.required, Validators.pattern(this.unamePattern)]],
	        op_last_name: ['', [ Validators.required, /* Validators.pattern(this.unamePattern) */]],
	        // op_password: ['', [ Validators.required, Validators.pattern(this.pwdPattern)]],
	        op_mobile_no: ['', [ Validators.required, Validators.pattern(this.mobnumPattern)]],
	        op_alternative_mobile_checbox : this.formBuilder.control(false), 
	        op_alternative_mobile_no: ['', [ Validators.pattern(this.mobnumPattern)]],
	        op_email: ['', [ Validators.required, Validators.pattern(this.emailPattern)]],
         	op_gender: ['',  Validators.required],
         	op_dob: '', /*['',  Validators.required],*/
	        op_adhar_card_no: [],
	        op_pan_no: '',
         	op_pet_name: this.formBuilder.control(''),
         	op_address_line_1: ['',  Validators.required],
         	op_address_line_2: this.formBuilder.control(''),
         	op_address_line_3: this.formBuilder.control(''),
         	op_address_pin_code: ['', Validators.required],
         	op_landmark: this.formBuilder.control(''),
         	op_address_city: ['1',  Validators.required],
         	op_address_state: ['27', Validators.required],
         	op_type: ['', Validators.required],
         	status: this.formBuilder.control('login'),
	        id :  this.formBuilder.control(this.userid),
	        op_profile: '',
	        // agree_terms_condition: ['', Validators.required]
	        agree_terms_condition :  this.formBuilder.control(''),
	        profile_pic_arr :  this.formBuilder.control(null),
	        veh_driving_licence_no : ['', Validators.required],
	        veh_licence_validity : ['', Validators.required],
	    });
	}

	public adharValidation(){
		console.log('in adhar validation function');
	}
	// convenience getter for easy access to form fields Personal Information
	get p() { return this.personalInfoForm.controls; }

	check_personal_terms_condition(){
		console.log('clicked vehicle t&c');
		this.is_personal_tc = true;	
	}

	changeValue(value) {
		this.personalInfoForm.value.op_alternative_mobile_checbox = value;
		if(value == true){
			this.sameMobile = true;
			this.personalInfoForm.value.op_alternative_mobile_checbox = this.personalInfoForm.value.op_mobile_no;
		}else{
			this.sameMobile = false;
		}
	} 

	changeTCondition(value){
		console.log('check personal terms and condition');
		console.log(value);
		this.personalInfoForm.value.agree_terms_condition = value;
	}

	onFileChange(event) {
		this.selectedFile = event.target.files;
		console.log(this.selectedFile);
		this.filename = this.selectedFile.item(0);
		this.personalInfoForm.value.op_profile = this.filename.name;
		this.personalInfoForm.value.profile_pic_arr = event.target.files;
		console.log('file details');
		console.log(event.target.files);
		console.log('profile filename');
		console.log(this.personalInfoForm.value.op_profile);
	}

	onSubmit(){
		this.submitted = true;
		console.log(this.personalInfoForm.value);
		console.log(this.personalInfoForm.value.op_dob);
		
		if (this.personalInfoForm.invalid) {
		    console.log('incorrect');
		    console.log(this.personalInfoForm.invalid);
		    return;
		}
		else {
			console.log('save personal information');
			console.log(this.personalInfoForm.value);
			this.personalInfoForm.value.status = 'login';
			this.personalInfoForm.value.id = this.userid;
			// this.upload();

			this.myprofileService.savePersonalInfo(this.personalInfoForm.value)
            .pipe(first())
            .subscribe(
                data => {
                	this.personalInfoResponse = data;
                	if(this.personalInfoResponse.response.status == 'success'){
            		 	// this.alertService.success('Personal information saved successful', true);
            			this.toastr.success('Personal information saved successfully.', 'Great!');
	            		// this.router.navigate(['/myprofile']);
	            		this.router.navigate(['/vehicle']);
                	}
                },
                error => {
                	console.log('error');
                	this.toastr.error('Something went wrong', 'Oops!');
                	// this.alertService.error('Something went wrong.');
                });
		}
	}

	// goToNext(form: any) {
	// 	if (this.onSubmit()) {
	// 		// Navigate to the work page
	// 		this.router.navigate(['/vehicle']);
	// 	}
	// }

}
