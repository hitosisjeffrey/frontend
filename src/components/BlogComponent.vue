<template>
    <q-page>


        <q-card class="my-card">
            <q-toolbar-title>Test Blogs</q-toolbar-title>

            <q-toolbar>
                <q-btn label="New Blog" color="primary" @click="createNewBlog" class="q-ml-auto" />
            </q-toolbar>

            <q-card-section>
                <q-input v-model="search" filled debounce="300" label="Search by title" clearable class="q-mb-md"
                    @keyup.enter="fetchBlogs">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>


                <div v-if="isLoading" class="q-pa-md row justify-center items-center">
                    <q-spinner color="primary" size="40px" />
                </div>
                <div v-else>
                    <q-table :rows="blogs" :columns="columns" row-key="id">
                        <!-- Custom column for actions -->
                        <template v-slot:body-cell-actions="props">
                            <q-td :props="props">
                                <q-btn flat dense round icon="more_vert" color="primary">
                                    <q-menu>
                                        <q-list style="min-width: 100px">
                                            <q-item clickable v-close-popup @click="editBlog(props.row.id)">
                                                <q-item-section avatar>
                                                    <q-icon name="edit" />
                                                </q-item-section>
                                                <q-item-section>Edit</q-item-section>
                                            </q-item>

                                            <q-item clickable v-close-popup @click="confirmDelete(props.row.id)">
                                                <q-item-section avatar>
                                                    <q-icon name="delete" color="negative" />
                                                </q-item-section>
                                                <q-item-section>Delete</q-item-section>
                                            </q-item>

                                            <q-item clickable v-close-popup
                                                @click="publishBlog(props.row.id, props.row.status)">
                                                <q-item-section avatar>
                                                    <q-icon name="publish" />
                                                </q-item-section>
                                                <q-item-section>{{ props.row.status === "PUBLISHED" ? "Unpublish" :
                                                    "Publish" }}</q-item-section>
                                            </q-item>

                                            <q-item clickable v-close-popup @click="previewBlog(props.row.id)">
                                                <q-item-section avatar>
                                                    <q-icon name="visibility" />
                                                </q-item-section>
                                                <q-item-section>Preview</q-item-section>
                                            </q-item>
                                        </q-list>
                                    </q-menu>
                                </q-btn>
                            </q-td>
                        </template>
                    </q-table>
                </div>

            </q-card-section>
        </q-card>

        <q-dialog v-model="isDeleteDialogVisible">
            <q-card class="q-pa-md" style="min-width: 350px;">
                <q-card-section class="row items-center q-pb-none">
                    <q-icon name="warning" color="negative" size="md" class="q-mr-sm" />
                    <div class="text-h6">Confirm Deletion</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <div>
                        Are you sure you want to permanently delete this blog? This action <span
                            class="text-negative text-bold">cannot be undone</span>.
                    </div>
                </q-card-section>

                <q-card-actions align="right" class="q-gutter-sm">
                    <q-btn label="Cancel" color="secondary" flat @click="isDeleteDialogVisible = false" />
                    <q-btn label="Delete" color="negative" unelevated @click="deleteBlog" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- PostDialog Component -->
        <q-dialog v-model="showDialog" persistent>
            <q-card style="min-width: 800px">
                <q-card-section>
                    <div class="text-h6">Create Post</div>
                </q-card-section>

                <q-card-section>
                    <q-input ref="titleRef" v-model="form.title" label="Title"
                        :rules="[val => !!val || 'Title is required']" />

                    <q-editor v-model="form.content" label="Content" :definitions="definitions" class="q-mt-md" />

                    <q-toggle v-model="form.isPublished" label="Published" left-label class="q-mt-md" />
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn label="Cancel" color="secondary" flat @click="showDialog = false" />
                    <q-btn label="Submit" color="primary" @click="submitForm" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- Preview Page-->
        <q-dialog v-model="showPreview" persistent>
            <q-card style="min-width: 800px">
                <q-card-section>
                    <div class="text-h6">Preview</div>
                </q-card-section>

                <q-card-section>

                    <q-card-section>
                        <div class="q-mb-md text-h5">{{ form.title }}</div>
                        <div class="text-body1" v-html="form.content"></div>
                    </q-card-section>

                </q-card-section>

                <q-card-actions align="right">
                    <q-btn label="Close" color="secondary" flat @click="showPreview = false" />
                </q-card-actions>
            </q-card>
        </q-dialog>

    </q-page>
</template>

<script lang="ts">
import { blogService } from 'src/services/blog-service'
import type { Blog } from './models.js';
import type { PayLoad } from '../services/blog-service.js';

let blogToDelete: number = 0;

export default {
    data() {
        return {
            blogs: [] as Blog[],
            columns: [
                { name: 'id', label: 'ID', align: 'left', field: 'id', sortable: true },
                { name: 'title', label: 'Title', align: 'left', field: 'title', sortable: true },
                { name: 'status', label: 'Status', align: 'left', field: 'status', sortable: true },
                {
                    name: 'author',
                    label: 'Author',
                    align: 'left',
                    field: 'author'
                    , sortable: true
                },
                { name: 'created_at', label: 'Created At', align: 'left', field: 'created_at', sortable: true },
                { name: 'updated_at', label: 'Updated At', align: 'left', field: 'updated_at', sortable: true },
                { name: 'actions', label: 'Actions', align: 'left', field: 'actions' }
            ],
            isDeleteDialogVisible: false,
            showDialog: false,
            isEdit: false,
            editId: 0,
            form: {
                title: '',
                content: '',
                isPublished: false,
            },
            definitions: {
                bold: {
                    label: 'Bold',
                    icon: 'format_bold',
                    tip: 'Bold your text',
                },
                italic: {
                    label: 'Italic',
                    icon: 'format_italic',
                    tip: 'Italicize your text',
                },
                underline: {
                    label: 'Underline',
                    icon: 'format_underlined',
                    tip: 'Underline your text',
                },
                quote: {
                    label: 'Quote',
                    icon: 'format_quote',
                    tip: 'Insert a blockquote',
                },
            },
            isLoading: false,
            showPreview: false,
            search: ""
        }
    },
    async mounted() {
        await this.fetchBlogs()  // Call the async function to fetch blogs
    },
    methods: {
        async fetchBlogs() {

            try {
                this.isLoading = true;
                const response = await blogService.getBlogs(this.search === null ? "" : this.search)  // Fetch blogs using the generalized request method
                this.blogs = response?.data;

            } catch (error) {
                console.log(error)
            } finally {
                this.isLoading = false
            }
        },

        async editBlog(id: number) {
            this.editId = id;
            this.isEdit = true;

            try {
                const response = await blogService.getBlog(id);
                this.form = {
                    title: response?.data?.title,
                    content: response?.data?.content,
                    isPublished: response?.data?.status === "PUBLISHED" ? true : false
                }
                this.showDialog = true;

            } catch (e) {
                console.log(e)
            }
        },
        async deleteBlog() {
            try {
                await blogService.deleteBlog(blogToDelete);
                this.blogs = this.blogs.filter((b: Blog) => b.id !== blogToDelete);
                this.isDeleteDialogVisible = false;
            } catch (e) {
                console.log(e)
            }
        },
        confirmDelete(id: number) {
            blogToDelete = id;
            this.isDeleteDialogVisible = true;
        },
        createNewBlog() {
            this.isEdit = false;
            this.clearForm();
            this.showDialog = true;
        },
        async publishBlog(id: number, oldStatus: string) {
            const newStatus = oldStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
            try {
                await blogService.updateStatus(id, newStatus);
                this.blogs = this.blogs.map((d: Blog) => {
                    if (d.id === id) {
                        return {
                            ...d,
                            status: newStatus
                        };
                    }
                    return d;
                }) as Blog[];
            } catch (e) {
                console.log(e)
            }
        },
        async previewBlog(id: number) {

            try {
                const response = await blogService.getBlog(id);
                this.form = {
                    title: response?.data?.title,
                    content: response?.data?.content,
                    isPublished: response?.data?.status === "PUBLISHED" ? true : false
                }
                this.showPreview = true;

            } catch (e) {
                console.log(e)
            }
        },
        async submitForm() {
            const form = this.form;
            try {
                const data: PayLoad = {
                    title: form.title,
                    content: form.content,
                    status: form.isPublished ? "PUBLISHED" : "DRAFT"
                };

                if (!this.isEdit) {
                    await blogService.createBlog(data);
                } else {
                    await blogService.updateBlog(this.editId, data);
                }

                await this.fetchBlogs();
                //clear
                this.clearForm();
                this.showDialog = false;
            } catch (e) {
                console.log(e)
            }


        },
        clearForm() {
            this.form = {
                title: "",
                content: "",
                isPublished: false
            }
        }
    }
}
</script>
<style scoped>
.my-card {
    max-width: 1200px;
    min-width: 1200px;
    /* Set the minimum width here */
    margin: 20px auto;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>