<script lang="ts">
	import type { PageData } from './$types';

	import Button from '$ui/components/button.svelte';
	import EmptyState from '$ui/components/empty-state.svelte';

	let { data }: { data: PageData } = $props();

	function formatDate(date: Date | string | null) {
		if (!date) return '—';
		return new Intl.DateTimeFormat('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		}).format(new Date(date));
	}
</script>

<section class="flex items-end justify-between gap-4">
	<div>
		<p class="kicker">News</p>
		<h1 class="page-title mt-3">News & Announcements</h1>
		<p class="page-copy mt-4 max-w-2xl">
			{#if data.canManageNews}
				Create and manage news articles. Drafts are only visible to admins and managers.
			{:else}
				Latest published news and announcements from the team.
			{/if}
		</p>
	</div>

	{#if data.canManageNews}
		<a href="/news/create" class="shrink-0">
			<Button>New Article</Button>
		</a>
	{/if}
</section>

<section class="mt-8">
	{#if data.articles.length === 0}
		<EmptyState
			title="No news articles yet"
			copy="Create the first article to share updates with your team."
		>
			{#snippet action()}
				{#if data.canManageNews}
					<a href="/news/create">
						<Button>New Article</Button>
					</a>
				{/if}
			{/snippet}
		</EmptyState>
	{:else}
		<div class="panel overflow-hidden">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-line/80 bg-canvas/60">
						<th class="px-5 py-3 text-left font-semibold text-ink">Title</th>
						{#if data.canManageNews}
							<th class="px-5 py-3 text-left font-semibold text-ink">Status</th>
						{/if}
						<th class="px-5 py-3 text-left font-semibold text-ink">Author</th>
						<th class="px-5 py-3 text-left font-semibold text-ink">Date</th>
						<th class="px-5 py-3 text-left font-semibold text-ink">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data.articles as article, i}
						<tr
							class="border-b border-line/50 transition hover:bg-brand-soft/20 {i ===
							data.articles.length - 1
								? 'border-b-0'
								: ''}"
						>
							<td class="px-5 py-4">
								<div>
									<p class="font-semibold text-ink">{article.title}</p>
									{#if article.summary}
										<p class="mt-0.5 max-w-sm truncate text-xs text-muted">{article.summary}</p>
									{/if}
								</div>
							</td>

							{#if data.canManageNews}
								<td class="px-5 py-4">
									{#if article.status === 'published'}
										<span
											class="rounded-full bg-success/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-success"
										>
											Published
										</span>
									{:else}
										<span
											class="rounded-full bg-warning/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-warning"
										>
											Draft
										</span>
									{/if}
								</td>
							{/if}

							<td class="px-5 py-4 text-muted">{article.authorName}</td>

							<td class="px-5 py-4 text-muted">
								{article.status === 'published'
									? formatDate(article.publishedAt)
									: formatDate(article.createdAt)}
							</td>

							<td class="px-5 py-4">
								<div class="flex items-center gap-3">
									<a
										href="/news/{article.id}"
										class="font-semibold no-underline hover:text-brand"
									>
										View
									</a>
									{#if data.canManageNews}
										<a
											href="/news/{article.id}/edit"
											class="font-semibold no-underline hover:text-brand"
										>
											Edit
										</a>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</section>
