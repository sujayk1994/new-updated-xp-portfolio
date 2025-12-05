<svelte:options accessors={true} />

<script>
    import Window from "../../../lib/components/xp/Window.svelte";
    import { runningPrograms } from "../../../lib/store";
    import { onMount } from "svelte";

    export let id;
    export let window;
    export let self;
    export let parentNode;
    export let exec_path;

    let toEmail = "";
    let fromEmail = "";
    let subject = "";
    let body = "";
    let sending = false;
    let statusMessage = "";
    let statusType = "";
    let linkedinUrl = "";

    export let options = {
        title: "Contact Me",
        min_width: 400,
        min_height: 350,
        width: 550,
        height: 480,
        icon: "/images/xp/icons/ContactMe.webp",
        id: id,
        exec_path
    };

    onMount(async () => {
        await loadOwnerInfo();
    });

    async function loadOwnerInfo() {
        try {
            const response = await fetch('/api/admin/about-me');
            const data = await response.json();
            if (data.success && data.content) {
                if (data.content.email) {
                    toEmail = data.content.email;
                } else {
                    toEmail = "owner@example.com";
                }
                if (data.content.socialLinks && data.content.socialLinks.linkedin) {
                    linkedinUrl = data.content.socialLinks.linkedin;
                }
            } else {
                toEmail = "owner@example.com";
            }
        } catch (error) {
            toEmail = "owner@example.com";
        }
    }

    function openLinkedIn() {
        if (linkedinUrl) {
            window.open(linkedinUrl, '_blank');
        }
    }

    async function sendMessage() {
        if (!fromEmail.trim()) {
            statusMessage = "Please enter your email address";
            statusType = "error";
            return;
        }
        if (!subject.trim()) {
            statusMessage = "Please enter a subject";
            statusType = "error";
            return;
        }
        if (!body.trim()) {
            statusMessage = "Please enter a message";
            statusType = "error";
            return;
        }

        sending = true;
        statusMessage = "";

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: toEmail,
                    from: fromEmail,
                    subject: subject,
                    body: body
                })
            });

            const data = await response.json();
            
            if (data.success) {
                statusMessage = "Message sent successfully!";
                statusType = "success";
                fromEmail = "";
                subject = "";
                body = "";
            } else {
                statusMessage = data.error || "Failed to send message";
                statusType = "error";
            }
        } catch (error) {
            statusMessage = "Error sending message. Please try again.";
            statusType = "error";
        }

        sending = false;
    }

    function newMessage() {
        fromEmail = "";
        subject = "";
        body = "";
        statusMessage = "";
        statusType = "";
    }

    export async function destroy() {
        close_program();
    }

    function close_program() {
        runningPrograms.update((programs) => programs.filter((p) => p != self));
        self.$destroy();
    }
</script>

<Window
    {options}
    bind:this={window}
    on_click_close={destroy}
>
    <div slot="content" class="contact-container absolute inset-0 top-0 flex flex-col bg-[#ece9d8]">
        <div class="menu-bar flex items-center gap-1 px-1 py-0.5 bg-[#ece9d8] border-b border-gray-300 text-xs">
            <span class="px-2 py-0.5 hover:bg-blue-600 hover:text-white cursor-pointer">File</span>
            <span class="px-2 py-0.5 hover:bg-blue-600 hover:text-white cursor-pointer">Edit</span>
            <span class="px-2 py-0.5 hover:bg-blue-600 hover:text-white cursor-pointer">View</span>
            <span class="px-2 py-0.5 hover:bg-blue-600 hover:text-white cursor-pointer">Tools</span>
            <span class="px-2 py-0.5 hover:bg-blue-600 hover:text-white cursor-pointer">Help</span>
        </div>

        <div class="toolbar flex items-center gap-2 px-2 py-1.5 bg-gradient-to-b from-[#f6f4ec] to-[#ece9d8] border-b border-gray-300">
            <button on:click={sendMessage} disabled={sending}
                class="flex items-center gap-1 px-2 py-1 text-xs bg-transparent hover:bg-blue-100 rounded border border-transparent hover:border-blue-300 disabled:opacity-50">
                <img src="/images/xp/icons/OESend.png" alt="" class="w-4 h-4" />
                <span>Send Message</span>
            </button>
            <button on:click={newMessage}
                class="flex items-center gap-1 px-2 py-1 text-xs bg-transparent hover:bg-blue-100 rounded border border-transparent hover:border-blue-300">
                <img src="/images/xp/icons/OECreateMail.png" alt="" class="w-4 h-4" />
                <span>New Message</span>
            </button>
            <div class="border-l border-gray-400 h-5 mx-1"></div>
            {#if linkedinUrl}
                <button on:click={openLinkedIn}
                    class="flex items-center gap-1.5 px-2 py-1 text-xs bg-[#0077b5] text-white rounded hover:bg-[#005582] border border-[#005582]">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span>LinkedIn</span>
                </button>
            {/if}
        </div>

        <div class="form-area flex-1 flex flex-col p-2 gap-1.5 overflow-auto">
            <div class="field flex items-center gap-2 bg-white border border-gray-400 px-2 py-1.5">
                <label class="text-xs font-bold text-gray-700 w-14 shrink-0">To:</label>
                <input 
                    type="text" 
                    bind:value={toEmail}
                    readonly
                    class="flex-1 text-xs border-none outline-none bg-gray-100 text-gray-600"
                />
            </div>

            <div class="field flex items-center gap-2 bg-white border border-gray-400 px-2 py-1.5">
                <label class="text-xs font-bold text-gray-700 w-14 shrink-0">From:</label>
                <input 
                    type="email" 
                    bind:value={fromEmail}
                    placeholder="Your email address"
                    class="flex-1 text-xs border-none outline-none bg-transparent"
                />
            </div>

            <div class="field flex items-center gap-2 bg-white border border-gray-400 px-2 py-1.5">
                <label class="text-xs font-bold text-gray-700 w-14 shrink-0">Subject:</label>
                <input 
                    type="text" 
                    bind:value={subject}
                    placeholder="Subject of your message"
                    class="flex-1 text-xs border-none outline-none bg-transparent"
                />
            </div>

            <div class="body-area flex-1 flex flex-col mt-1">
                <textarea 
                    bind:value={body}
                    placeholder="Write your message here"
                    class="flex-1 w-full p-2 text-sm border border-gray-400 outline-none resize-none bg-white"
                ></textarea>
            </div>

            {#if statusMessage}
                <div class="status-bar px-2 py-1.5 text-xs rounded {statusType === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}">
                    {statusMessage}
                </div>
            {/if}
        </div>

        <div class="status-bar px-2 py-1.5 bg-[#ece9d8] border-t border-gray-300 text-xs text-gray-600">
            Compose a message to the owner
        </div>
    </div>
</Window>

<style>
    .contact-container {
        font-family: 'Tahoma', 'MS Sans Serif', Arial, sans-serif;
    }
    
    .contact-container input::placeholder,
    .contact-container textarea::placeholder {
        color: #999;
    }
</style>
