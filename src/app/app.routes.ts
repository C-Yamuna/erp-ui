import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainmenuComponent } from "./layout/mainmenu/mainmenu.component";
import { ChangePasswordComponent } from "./authentication/change-password/change-password.component";
import { ForgotPasswordComponent } from "./authentication/forgot-password/forgot-password.component";
import { LoginComponent } from "./authentication/login/login.component";
import { SavingsAccountApplicationApprovalComponent } from "./transcations/approval-transcations/savings-account-application-approval/savings_acc_approval/savings-account-application-approval.component";
import { SavingsApplicationApprovalComponent } from "./transcations/approval-transcations/savings-account-application-approval/savings-application-approval/savings-application-approval.component";
import { SavingsAccountTransactionAppovalComponent } from "./transcations/approval-transcations/savings-account-application-approval/savings-account-transaction-appoval/savings-account-transaction-appoval.component";
import { AuthGuard } from "./shared/auth/authguard.service";

export const routes: Routes = [

    { path: '', component: LoginComponent },

    {
        path: 'menu', component: MainmenuComponent,
        children: [
            { path: 'configurations', loadChildren: () => import('./configurations/configuration.module').then(m => m.ConfigurationModule), canActivate: [AuthGuard] },
            { path: 'membership_transaction', loadChildren: () => import('./transcations/membership-transcation/membership-transcation.module').then(m => m.MembershipTranscationModule), canActivate: [AuthGuard] },
            { path: 'savings_bank_transactions', loadChildren: () => import('./transcations/savings-bank-transcation/savings-bank-transcation.module').then(m => m.SavingsBankTranscationModule), canActivate: [AuthGuard] },
            { path: 'daily_deposits_transaction', loadChildren: () => import('./transcations/daily-deposits-transaction/daily-deposit-transaction.module').then(m => m.DailyDepositTransactionModule), canActivate: [AuthGuard] },
            { path: 'term_deposit_transaction', loadChildren: () => import('./transcations/term-deposits-transcation/term-deposits-transcation.module').then(m => m.TermDepositsTranscationModule), canActivate: [AuthGuard] },
            { path: 'loan_transaction', loadChildren: () => import('./transcations/loan-transcation/loan-transcation.module').then(m => m.LoanTranscationModule), canActivate: [AuthGuard] },
            { path: 'borrowing_transaction', loadChildren: () => import('./transcations/borrowing-transaction/borrowing-transaction.module').then(m => m.BorrowingTransactionModule), canActivate: [AuthGuard] },
            { path: 'investments_transaction', loadChildren: () => import('./transcations/investments-transaction/investments-transaction.module').then(m => m.InvestmentsTransactionModule), canActivate: [AuthGuard] },
            { path: 'agent_details_transaction', loadChildren: () => import('./transcations/agent-details-transaction/agent-details-transaction.module').then(m => m.AgentDetailsTransactionModule), canActivate: [AuthGuard] },
            { path: 'cash_counter_transaction', loadChildren: () => import('./transcations/cash-counter-transaction/cash-counter-transaction.module').then(m => m.CashCounterTransactionModule), canActivate: [AuthGuard] },
            { path: 'locker_transaction', loadChildren: () => import('./transcations/locker-transaction/locker-transaction.module').then(m => m.LockerTransactionModule), canActivate: [AuthGuard] },
            { path: 'membership_approval_details', loadChildren: () => import('./transcations/approval-transcations/membership-approval-details/membership-approval-details-routing.module').then(m => m.MembershipApprovalDetailsRoutingModule), canActivate: [AuthGuard] },
            { path: 'product_definition_approval', loadChildren: () => import('./transcations/product-definition-approval/product-definition-approval.module').then(m => m.ProductDefinitionApprovalModule), canActivate: [AuthGuard] },
            { path: 'approval_transactions', loadChildren: () => import('./transcations/approval-transcations/approval-transcations.module').then(m => m.ApprovalTranscationsModule), canActivate: [AuthGuard] },
            { path: 'savings_account_approval', component: SavingsAccountApplicationApprovalComponent },
            { path: 'savings_accounts_approval', component: SavingsApplicationApprovalComponent },
            { path: 'savings_account-transaction_approval', component: SavingsAccountTransactionAppovalComponent },
        ]
    },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'change_password', component: ChangePasswordComponent },
]
export const AppRoutes: ModuleWithProviders<any> = RouterModule.forRoot(routes);