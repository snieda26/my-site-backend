import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'
import { Auth } from '@common/decorators/auth.decorator'
import { CurrentAccount } from '@common/decorators/current-account.decorator'
import { PaginationDto } from '@common/dto/pagination.dto'
import { BookmarksService } from '../services/bookmarks.service'
import { CreateBookmarkDto } from '../dto/bookmark.dto'

@ApiTags('Bookmarks')
@Controller('bookmarks')
export class BookmarksController {
	constructor(private readonly bookmarksService: BookmarksService) {}

	@Get()
	@Auth()
	@ApiOperation({ summary: 'Get all user bookmarks' })
	@ApiResponse({ status: 200, description: 'Bookmarks retrieved successfully' })
	async getBookmarks(
		@CurrentAccount('accountId') accountId: string,
		@Query() query: PaginationDto
	) {
		return this.bookmarksService.findAll(accountId, query)
	}

	@Get('questions')
	@Auth()
	@ApiOperation({ summary: 'Get bookmarked questions' })
	@ApiResponse({ status: 200, description: 'Bookmarked questions retrieved successfully' })
	async getQuestionBookmarks(
		@CurrentAccount('accountId') accountId: string,
		@Query() query: PaginationDto
	) {
		return this.bookmarksService.getQuestionBookmarks(accountId, query)
	}

	@Get('problems')
	@Auth()
	@ApiOperation({ summary: 'Get bookmarked problems' })
	@ApiResponse({ status: 200, description: 'Bookmarked problems retrieved successfully' })
	async getProblemBookmarks(
		@CurrentAccount('accountId') accountId: string,
		@Query() query: PaginationDto
	) {
		return this.bookmarksService.getProblemBookmarks(accountId, query)
	}

	@Post()
	@Auth()
	@ApiOperation({ summary: 'Create a bookmark' })
	@ApiResponse({ status: 201, description: 'Bookmark created successfully' })
	async create(
		@CurrentAccount('accountId') accountId: string,
		@Body() dto: CreateBookmarkDto
	) {
		return this.bookmarksService.create(accountId, dto)
	}

	@Delete(':id')
	@Auth()
	@ApiOperation({ summary: 'Delete a bookmark' })
	@ApiParam({ name: 'id', description: 'Bookmark ID' })
	@ApiResponse({ status: 200, description: 'Bookmark deleted successfully' })
	async delete(
		@CurrentAccount('accountId') accountId: string,
		@Param('id') id: string
	) {
		return this.bookmarksService.delete(accountId, id)
	}
}
