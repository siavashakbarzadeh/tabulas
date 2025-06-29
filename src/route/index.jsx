import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "../layout/main";
import FullScreenLayout from "../layout/full-screen";

import EcommerceHomepage from "../pages/dashboard/Ecommerce";
import CopywriterHomepage from "../pages/dashboard/Copywriter";
import InvestHomepage from "../pages/dashboard/Invest";
import AnalyticsHomepage from "../pages/dashboard/Analytics";
import CryptoHomepage from "../pages/dashboard/Crypto";
import SalesHomepage from "../pages/dashboard/Sales";

import MessagesPage from "../pages/apps/Messages";
import FileManagerPage from "../pages/apps/FileManager";
import ChatsPage from "../pages/apps/Chats";
import CalendarPage from "../pages/apps/Calendar";

import ProjectsCardPage from "../pages/pre-built/projects/CardView";
import ProjectsListPage from "../pages/pre-built/projects/ListView";

import ProductsListPage from "../pages/pre-built/products/ListView";
import ProductsCardPage from "../pages/pre-built/products/CardView";
import ProductsDetailsPage from "../pages/pre-built/products/Details";

import InvoiceListPage from "../pages/pre-built/invoice/ListView";
import InvoiceDetailsPage from "../pages/pre-built/invoice/Details";
import InvoicePrintPage from "../pages/pre-built/invoice/Print";

import CustomersListPage from "../pages/pre-built/customers/ListView";
import CustomersDetailsPage from "../pages/pre-built/customers/Details";

import UsersListPage from "../pages/pre-built/users/ListView";
import UsersListCompactPage from "../pages/pre-built/users/ListViewCompact";
import UsersCardPage from "../pages/pre-built/users/CardView";
import UserDetailsPage from "../pages/pre-built/users/Details";
import UserProfilePage from "../pages/pre-built/users/Profile";

import PricingTablePage from "../pages/pre-built/PricingTable";
import ImageGalleryPage from "../pages/pre-built/ImageGallery";

import Error404Page from "../pages/errors/404";
import Error404ModernPage from "../pages/errors/404Modern";
import Error504Page from "../pages/errors/504";
import Error504ModernPage from "../pages/errors/504Modern";

import LoginPage from "../pages/auths/Login";
import LoginV2Page from "../pages/auths/LoginV2";
import LoginV3Page from "../pages/auths/LoginV3";
import RegisterPage from "../pages/auths/Register";
import RegisterV2Page from "../pages/auths/RegisterV2";
import RegisterV3Page from "../pages/auths/RegisterV3";
import ForgotPage from "../pages/auths/Forgot";
import ForgotV2Page from "../pages/auths/ForgotV2";
import ForgotV3Page from "../pages/auths/ForgotV3";
import SuccessPage from "../pages/auths/Success";
import SuccessV2Page from "../pages/auths/SuccessV2";
import SuccessV3Page from "../pages/auths/SuccessV3";

import BlankPage from "../pages/Blank";
import FaqsPage from "../pages/misc/Faqs";
import TermsPolicyPage from "../pages/misc/TermsPolicy";
import RegularV1Page from "../pages/misc/RegularV1";
import RegularV2Page from "../pages/misc/RegularV2";

import ComponentList from "../pages/components";
import NioIconsPage from "../pages/components/NioIcons";
import SvgIconsPage from "../pages/components/SvgIcons";
import ChartJsPage from "../pages/components/ChartJs";
import TailwindConfigPage from "../pages/components/TailwindConfig";

import Alerts from "../pages/components/elements/Alerts";
import Accordions from "../pages/components/elements/Accordions";
import AvatarPage from "../pages/components/elements/Avatars";
import ButtonPage from "../pages/components/elements/Buttons";
import ButtonGroupPage from "../pages/components/elements/ButtonGroup";
import BadgePage from "../pages/components/elements/Badges";
import BreadcrumbPage from "../pages/components/elements/Breadcrumb";
import CardsPage from "../pages/components/elements/Cards";
import DropdownPage from "../pages/components/elements/Dropdowns";
import ModalPage from "../pages/components/elements/Modals";
import PaginationPage from "../pages/components/elements/Paginations";
import PopoverPage from "../pages/components/elements/Popovers";
import ProgressPage from "../pages/components/elements/Progress";
import SpinnerPage from "../pages/components/elements/Spinners";
import TabsPage from "../pages/components/elements/Tabs";
import ToastPage from "../pages/components/elements/Toasts";
import TooltipsPage from "../pages/components/elements/Tooltips";
import TypographyPage from "../pages/components/elements/Typography";

import AdvancedControlPage from "../pages/components/forms/AdvancedControls";
import DateTimePickerPage from "../pages/components/forms/DateTimePicker";
import CheckboxRadioPage from "../pages/components/forms/CheckboxRadio";
import FormElementsPage from "../pages/components/forms/FormElements";
import FormLayoutsPage from "../pages/components/forms/FormLayouts";
import FormUploadPage from "../pages/components/forms/FormUpload";
import FormValidationPage from "../pages/components/forms/FormValidation";
import InputGroupPage from "../pages/components/forms/InputGroup";
import NoUiSliderPage from "../pages/components/forms/NoUiSlider";
import NumberSpinnerPage from "../pages/components/forms/NumberSpinner";

import BasicTablesPage from "../pages/components/tables/BasicTables";
import DataTablesPage from "../pages/components/tables/DataTables";
import ThemeProvider from "../layout/context";

import { useLocation } from "react-router";
import MainPage from "../pages/main";
import NewLoginPage from "../pages/login";
import ConfirmPage from "../pages/confirm";
import FinalizePage from "../pages/finalize";
import EmailPage from "../pages/email";
import ThemeProvider2 from "../layout/context2";
import DashboardLayout from "../layout/dashboard";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./privateRoute";
import ServicePage from "../pages/services";
import GuidemanualiPage from "../pages/guidemanuali";
import EbookPage from "../pages/ebook";
import CommissioniPage from "../pages/commissioni";
import CommissioniPermanentiPage from "../pages/commissioni/CommissioniPermanentiPage.jsx";
import BicameraliEDelegazioniPage from "../pages/commissioni/BicameraliEDelegazioniPage.jsx";
import GiunteEAltreComissioniPage from "../pages/commissioni/GiunteEAltreComissioniPage.jsx";
import UltimiattiPage from "../pages/ultimiatti";
import Ultimidossierage from "../pages/ultimdossier";
import Ultimidossierage1 from "../pages/ultimdossier1";
import FormPage from "../pages/form";
import DetailsPage from "../pages/details";
import InboxPage from "../pages/inbox";
import OutboxPage from "../pages/outbox";
import NotificationPage from "../pages/notification/index.jsx";
import PushedMessagesPage from "../pages/pushed/index.jsx";
import DirettaPage from "../pages/diretta/index.jsx";
import ExportStorage from "../pages/ExportStorage/ExportStorage.jsx";
import AccountPage from "./pages/AccountPage";


const ScrollToTop = (props) => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return <>{props.children}</>;
};

function Router() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <ScrollToTop>
        <Routes>
          <Route element={<ThemeProvider2 />}>
            <Route element={<PrivateRoute />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<MainPage />} />
                <Route path="/confirm/:id" element={<ConfirmPage />} />
                <Route path="/finalize/:id" element={<FinalizePage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="email" element={<EmailPage />} />
                <Route path="services" element={<ServicePage />} />
                <Route path="form" element={<FormPage />} />
                <Route path="details/:id" element={<DetailsPage />} />
                <Route path="guidemanuali" element={<GuidemanualiPage />} />
                <Route path="ebook" element={<EbookPage />} />
                <Route path="commissioni" element={<CommissioniPage />} />
                <Route path="commissioni-permanenti" element={<CommissioniPermanentiPage />} />
                <Route path="giunte-e-altre-comissioni" element={<GiunteEAltreComissioniPage />} />
                <Route path="bicamerali-e-delegazioni" element={<BicameraliEDelegazioniPage />} />
                <Route path="ultimiatti" element={<UltimiattiPage />} />
                <Route path="ultimdossier" element={<Ultimidossierage />} />
                <Route path="ultimdossier1" element={<Ultimidossierage1 />} />
                <Route path="notification" element={<NotificationPage />} />
                <Route path="pushed" element={<PushedMessagesPage />} />
                <Route path="inbox" element={<InboxPage />} />
                <Route path="outbox" element={<OutboxPage />} />
                <Route path="diretta" element={<DirettaPage />} />
                <Route path='export-storage' element={<ExportStorage/>}/>

              </Route>
            </Route>
            <Route path="login" element={<NewLoginPage />} />
          </Route>
          <Route element={<ThemeProvider />}>
            <Route element={<FullScreenLayout />}>
              <Route path="*" element={<Error404ModernPage />} />
              <Route path="errors/404-classic" element={<Error404Page />} />
              <Route
                path="errors/404-modern"
                element={<Error404ModernPage />}
              />
              <Route path="errors/504-classic" element={<Error504Page />} />
              <Route
                path="errors/504-modern"
                element={<Error504ModernPage />}
              />

              <Route path="auths/auth-login" element={<LoginPage />} />
              <Route path="auths/auth-login-v2" element={<LoginV2Page />} />
              <Route path="auths/auth-login-v3" element={<LoginV3Page />} />
              <Route path="auths/auth-register" element={<RegisterPage />} />
              <Route
                path="auths/auth-register-v2"
                element={<RegisterV2Page />}
              />
              <Route
                path="auths/auth-register-v3"
                element={<RegisterV3Page />}
              />
              <Route path="auths/auth-reset" element={<ForgotPage />} />
              <Route path="auths/auth-reset-v2" element={<ForgotV2Page />} />
              <Route path="auths/auth-reset-v3" element={<ForgotV3Page />} />
              <Route path="auths/auth-success" element={<SuccessPage />} />
              <Route path="auths/auth-success-v2" element={<SuccessV2Page />} />
              <Route path="auths/auth-success-v3" element={<SuccessV3Page />} />

              <Route
                path="invoice-print/:invoiceId"
                element={<InvoicePrintPage />}
              ></Route>
            </Route>
            <Route element={<Layout container />}>
              <Route path="product-card" element={<ProductsCardPage />} />
              <Route
                path="product-details/:productId"
                element={<ProductsDetailsPage />}
              />

              <Route
                path="customer-details/:customerId"
                element={<CustomersDetailsPage />}
              />
            </Route>
            <Route element={<Layout />}>
              <Route path="index2" element={<EcommerceHomepage />} />
              <Route path="home" element={<MainPage />} />
              <Route path="copywriter" element={<CopywriterHomepage />} />
              <Route path="sales" element={<SalesHomepage />} />
              <Route path="crypto" element={<CryptoHomepage />} />
              <Route path="analytics" element={<AnalyticsHomepage />} />
              <Route path="invest" element={<InvestHomepage />} />

              <Route path="apps-messages" element={<MessagesPage />} />
              <Route path="apps-file-manager" element={<FileManagerPage />} />
              <Route path="apps-chats" element={<ChatsPage />} />
              <Route path="apps-calendar" element={<CalendarPage />} />

              <Route path="project-card" element={<ProjectsCardPage />} />
              <Route path="project-list" element={<ProjectsListPage />} />

              <Route path="product-list" element={<ProductsListPage />} />

              <Route path="invoice-list" element={<InvoiceListPage />} />
              <Route
                path="invoice-details/:invoiceId"
                element={<InvoiceDetailsPage />}
              />

              <Route path="user-list-regular" element={<UsersListPage />} />
              <Route
                path="user-list-compact"
                element={<UsersListCompactPage />}
              />
              <Route path="user-card" element={<UsersCardPage />} />
              <Route
                path="user-details/:userId"
                element={<UserDetailsPage />}
              />
              <Route
                path="user-profile-regular"
                element={<UserProfilePage />}
              />

              <Route path="customer-list" element={<CustomersListPage />} />

              <Route path="pricing-table" element={<PricingTablePage />} />
              <Route path="gallery" element={<ImageGalleryPage />} />

              <Route path="_blank" element={<BlankPage />} />
              <Route path="faqs" element={<FaqsPage />} />
              <Route path="terms-policy" element={<TermsPolicyPage />} />
              <Route path="regular-v1" element={<RegularV1Page />} />
              <Route path="regular-v2" element={<RegularV2Page />} />

              <Route path="components">
                <Route index element={<ComponentList />} />
                <Route path="elements/alerts" element={<Alerts />} />
                <Route path="elements/accordions" element={<Accordions />} />
                <Route path="elements/avatar" element={<AvatarPage />} />
                <Route path="elements/badges" element={<BadgePage />} />
                <Route path="elements/buttons" element={<ButtonPage />} />
                <Route
                  path="elements/buttons-group"
                  element={<ButtonGroupPage />}
                />
                <Route
                  path="elements/breadcrumb"
                  element={<BreadcrumbPage />}
                />
                <Route path="elements/cards" element={<CardsPage />} />
                <Route
                  path="elements/list-dropdown"
                  element={<DropdownPage />}
                />
                <Route path="elements/modals" element={<ModalPage />} />
                <Route
                  path="elements/pagination"
                  element={<PaginationPage />}
                />
                <Route path="elements/popover" element={<PopoverPage />} />
                <Route path="elements/progress" element={<ProgressPage />} />
                <Route path="elements/spinner" element={<SpinnerPage />} />
                <Route path="elements/tabs" element={<TabsPage />} />
                <Route path="elements/toast" element={<ToastPage />} />
                <Route path="elements/tooltip" element={<TooltipsPage />} />
                <Route
                  path="elements/typography"
                  element={<TypographyPage />}
                />

                <Route
                  path="forms/advanced-controls"
                  element={<AdvancedControlPage />}
                />
                <Route
                  path="forms/datetime-picker"
                  element={<DateTimePickerPage />}
                />
                <Route
                  path="forms/checkbox-radio"
                  element={<CheckboxRadioPage />}
                />
                <Route
                  path="forms/form-elements"
                  element={<FormElementsPage />}
                />
                <Route
                  path="forms/form-layouts"
                  element={<FormLayoutsPage />}
                />
                <Route
                  path="forms/form-validation"
                  element={<FormValidationPage />}
                />
                <Route path="forms/form-upload" element={<FormUploadPage />} />
                <Route path="forms/input-group" element={<InputGroupPage />} />
                <Route path="forms/nouislider" element={<NoUiSliderPage />} />
                <Route
                  path="forms/number-spinner"
                  element={<NumberSpinnerPage />}
                />

                <Route
                  path="tables/basic-table"
                  element={<BasicTablesPage />}
                />
                <Route path="tables/data-table" element={<DataTablesPage />} />

                <Route path="chartjs" element={<ChartJsPage />} />
                <Route path="nioicon" element={<NioIconsPage />} />
                <Route path="svg-icons" element={<SvgIconsPage />} />
                <Route
                  path="tailwind-config"
                  element={<TailwindConfigPage />}
                />
              </Route>
            </Route>
          </Route>
        </Routes>
      </ScrollToTop>
    </BrowserRouter>
  );
}

export default Router;
