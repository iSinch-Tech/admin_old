import { createBrowserRouter, Navigate } from "react-router-dom";
import UsersPage from "../pages/Users";
import AuthPage from "../pages/Auth";
import UserPage from "../pages/User";
import CategoriesPage from "../pages/Categories";
import TicketsPage from "../pages/Tickets";
import TicketPage from "../pages/Ticket";
import QuestionsPage from "../pages/Questions";
import QuestionPage from "../pages/Question";
import TopicsPage from "../pages/Topics";
import TopicPage from "../pages/Topic";
import { NewsPage, NewsPostPage } from "../pages/News";
import { PartnerPage, PartnersPage } from "../pages/Partners";
import PagesPage from "../pages/Pages/Pages";
import PagePage from "../pages/Pages/Page";
import SchedulePage from "../pages/Schedule";

const router = createBrowserRouter([
	{
		path: "/auth",
		element: <AuthPage />,
	},
	{
		path: "/users",
		element: <UsersPage />,
		exact: true
	},
	{
		path: "/users/:userId",
		element: <UserPage />,
	},
	{
		path: "/categories",
		element: <CategoriesPage />,
	},
	{
		path: "/tickets/:categoryId",
		element: <TicketsPage />,
	},
	{
		path: "/tickets/:categoryId/:ticketId",
		element: <TicketPage />,
	},
	{
		path: "/questions",
		element: <QuestionsPage />,
	},
	{
		path: "/questions/:id",
		element: <QuestionPage />,
	},
	{
		path: "/topics",
		element: <TopicsPage />,
	},
	{
		path: "/topics/:topicId",
		element: <TopicPage />,
	},
	{
		path: "/news",
		element: <NewsPage />,
	},
	{
		path: "/news/:newsId",
		element: <NewsPostPage />,
	},
	{
		path: "/partners",
		element: <PartnersPage />,
	},
	{
		path: "/partners/:partnerId",
		element: <PartnerPage />,
	},
	{
		path: "/pages",
		element: <PagesPage />,
	},
	{
		path: "/pages/:pageId",
		element: <PagePage />,
	},
	{
		path: "/schedule",
		element: <SchedulePage />,
	},
	{
		path: "/schedule/:month",
		element: <SchedulePage />,
	},
	{
		path: "*",
		element: <Navigate to="/users" />
	}
], {
	basename: "/admin_old",
});

export default router;