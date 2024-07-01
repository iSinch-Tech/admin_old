import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import HandshakeOutlined from '@mui/icons-material/HandshakeOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import WebOutlined from '@mui/icons-material/WebOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export const pages = [
	{
		title: 'Пользователи',
		to: '/users',
		icon: GroupOutlinedIcon
	},
	{
		title: 'Категории',
		to: '/categories',
		icon: AutoStoriesOutlinedIcon
	},
	{
		title: 'Темы',
		to: '/topics',
		icon: QuestionAnswerIcon
	},
	{
		title: 'Вопросы',
		to: '/questions',
		icon: QuestionAnswerIcon
	},
	{
		title: 'Новости',
		to: '/news',
		icon: ArticleOutlined
	},
	{
		title: 'Партнеры',
		to: '/partners',
		icon: HandshakeOutlined
	},
	{
		title: 'Страницы',
		to: '/pages',
		icon: WebOutlined
	},
	{
		title: 'Расписание',
		to: '/schedule',
		icon: CalendarMonthIcon
	}
];



