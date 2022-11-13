var Options;
(function (Options) {
    function createSettingHTML(title, description, settingHTML) {
        return Util.buildHTML('tr', {
            content: [
                Util.buildHTML('td', {
                    content: [
                        Util.buildHTML('div', {
                            class: 'setting-title',
                            content: [title]
                        }),
                        Util.buildHTML('div', {
                            class: 'setting-description action',
                            content: ["<span class=\"setting-description sym-collapsed\">+</span> Description</div>"]
                        }),
                        Util.buildHTML('div', {
                            class: 'setting-description text-collapsed',
                            content: [description]
                        })
                    ]
                }),
                Util.buildHTML('td', {
                    content: [settingHTML]
                }),
                Util.buildHTML('td')
            ]
        });
    }
    function createCheckboxOption(setting, info) {
        return createSettingHTML(info.title, info.description, Util.buildHTML('input', {
            id: setting,
            attributes: {
                'type': 'checkbox',
                'data-target': 'checkbox'
            }
        }));
    }
    function init() {
        document.getElementById('settings-normal').innerHTML += createCheckboxOption("data_protection" /* DATA_PROTECTION */, {
            title: 'Data Protection',
            description: 'Blur some settings on the account page to protect yourself'
        });
        // add events
        document.querySelectorAll('[data-target]').forEach(function (element) {
            switch (element.getAttribute('data-target')) {
                case 'checkbox':
                    element.onclick = function () { return console.debug('click'); };
                    break;
            }
        });
        document.querySelectorAll('.setting-description.action').forEach(function (element) {
            element.onclick = function (event) {
                var collapsedText = element.parentElement.querySelector('.setting-description.text-collapsed');
                var symCollapsed = element.querySelector('.setting-description.sym-collapsed');
                var expandedText = element.parentElement.querySelector('.setting-description.text-expanded');
                var symExpanded = element.querySelector('.setting-description.sym-expanded');
                if (collapsedText) {
                    collapsedText.setAttribute('class', 'setting-description text-expanded');
                    symCollapsed.innerText = '-';
                    symCollapsed.setAttribute('class', 'setting-description sym-expanded');
                }
                if (expandedText) {
                    expandedText.setAttribute('class', 'setting-description text-collapsed');
                    symExpanded.innerText = '+';
                    symExpanded.setAttribute('class', 'setting-description sym-collapsed');
                }
            };
        });
    }
    init();
})(Options || (Options = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9wdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxPQUFPLENBd0ZiO0FBeEZELFdBQU8sT0FBTztJQVlWLFNBQVMsaUJBQWlCLENBQUMsS0FBYSxFQUFFLFdBQW1CLEVBQUUsV0FBbUI7UUFDOUUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRTtZQUN4QixPQUFPLEVBQUU7Z0JBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUU7b0JBQ2pCLE9BQU8sRUFBRTt3QkFDTCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRTs0QkFDbEIsS0FBSyxFQUFFLGVBQWU7NEJBQ3RCLE9BQU8sRUFBRSxDQUFFLEtBQUssQ0FBRTt5QkFDckIsQ0FBQzt3QkFDRixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRTs0QkFDbEIsS0FBSyxFQUFFLDRCQUE0Qjs0QkFDbkMsT0FBTyxFQUFFLENBQUUsOEVBQTRFLENBQUU7eUJBQzVGLENBQUM7d0JBQ0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUU7NEJBQ2xCLEtBQUssRUFBRSxvQ0FBb0M7NEJBQzNDLE9BQU8sRUFBRSxDQUFFLFdBQVcsQ0FBRTt5QkFDM0IsQ0FBQztxQkFDTDtpQkFDSixDQUFDO2dCQUNGLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFO29CQUNqQixPQUFPLEVBQUUsQ0FBRSxXQUFXLENBQUU7aUJBQzNCLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7YUFDdkI7U0FDSixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsU0FBUyxvQkFBb0IsQ0FBQyxPQUFpQixFQUFFLElBQWlCO1FBQzlELE9BQU8saUJBQWlCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFO1lBQzNFLEVBQUUsRUFBRSxPQUFPO1lBQ1gsVUFBVSxFQUFFO2dCQUNSLE1BQU0sRUFBRSxVQUFVO2dCQUNsQixhQUFhLEVBQUUsVUFBVTthQUM1QjtTQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztJQUVELFNBQVMsSUFBSTtRQUNULFFBQVEsQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxTQUFTLElBQUksb0JBQW9CLDBDQUEyQjtZQUNuRyxLQUFLLEVBQUUsaUJBQWlCO1lBQ3hCLFdBQVcsRUFBRSw0REFBNEQ7U0FDNUUsQ0FBQyxDQUFDO1FBRUgsYUFBYTtRQUNhLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUUsQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPO1lBQ2pGLFFBQVEsT0FBTyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsRUFBRTtnQkFDekMsS0FBSyxVQUFVO29CQUNYLE9BQU8sQ0FBQyxPQUFPLEdBQUcsY0FBTSxPQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQXRCLENBQXNCLENBQUM7b0JBQy9DLE1BQU07YUFDYjtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRXVCLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyw2QkFBNkIsQ0FBRSxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU87WUFDL0YsT0FBTyxDQUFDLE9BQU8sR0FBRyxVQUFDLEtBQUs7Z0JBQ3BCLElBQUksYUFBYSxHQUFnQixPQUFPLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO2dCQUM1RyxJQUFJLFlBQVksR0FBZ0IsT0FBTyxDQUFDLGFBQWEsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO2dCQUM1RixJQUFJLFlBQVksR0FBZ0IsT0FBTyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsb0NBQW9DLENBQUMsQ0FBQztnQkFDMUcsSUFBSSxXQUFXLEdBQWdCLE9BQU8sQ0FBQyxhQUFhLENBQUMsbUNBQW1DLENBQUMsQ0FBQztnQkFFMUYsSUFBSSxhQUFhLEVBQUU7b0JBQ2YsYUFBYSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsbUNBQW1DLENBQUMsQ0FBQztvQkFDekUsWUFBWSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7b0JBQzdCLFlBQVksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLGtDQUFrQyxDQUFDLENBQUM7aUJBQzFFO2dCQUVELElBQUksWUFBWSxFQUFFO29CQUNkLFlBQVksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLG9DQUFvQyxDQUFDLENBQUM7b0JBQ3pFLFdBQVcsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO29CQUM1QixXQUFXLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxtQ0FBbUMsQ0FBQyxDQUFDO2lCQUMxRTtZQUNMLENBQUMsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELElBQUksRUFBRSxDQUFDO0FBRVgsQ0FBQyxFQXhGTSxPQUFPLEtBQVAsT0FBTyxRQXdGYiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSBPcHRpb25zIHtcclxuXHJcbiAgICAvLyBpbXBvcnRzXHJcbiAgICBpbXBvcnQgU2V0dGluZ3MgPSBFeHRlbnNpb25TZXR0aW5ncy5TZXR0aW5ncztcclxuXHJcbiAgICAvLyBtb2R1bGVcclxuXHJcbiAgICBpbnRlcmZhY2UgRGlzcGxheUluZm8ge1xyXG4gICAgICAgIHRpdGxlOiBzdHJpbmcsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IHN0cmluZ1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZVNldHRpbmdIVE1MKHRpdGxlOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcsIHNldHRpbmdIVE1MOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBVdGlsLmJ1aWxkSFRNTCgndHInLCB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IFtcclxuICAgICAgICAgICAgICAgIFV0aWwuYnVpbGRIVE1MKCd0ZCcsIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFV0aWwuYnVpbGRIVE1MKCdkaXYnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ3NldHRpbmctdGl0bGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogWyB0aXRsZSBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBVdGlsLmJ1aWxkSFRNTCgnZGl2Jywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdzZXR0aW5nLWRlc2NyaXB0aW9uIGFjdGlvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBbIGA8c3BhbiBjbGFzcz1cInNldHRpbmctZGVzY3JpcHRpb24gc3ltLWNvbGxhcHNlZFwiPis8L3NwYW4+IERlc2NyaXB0aW9uPC9kaXY+YCBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBVdGlsLmJ1aWxkSFRNTCgnZGl2Jywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdzZXR0aW5nLWRlc2NyaXB0aW9uIHRleHQtY29sbGFwc2VkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFsgZGVzY3JpcHRpb24gXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgVXRpbC5idWlsZEhUTUwoJ3RkJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFsgc2V0dGluZ0hUTUwgXVxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICBVdGlsLmJ1aWxkSFRNTCgndGQnKVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlQ2hlY2tib3hPcHRpb24oc2V0dGluZzogU2V0dGluZ3MsIGluZm86IERpc3BsYXlJbmZvKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gY3JlYXRlU2V0dGluZ0hUTUwoaW5mby50aXRsZSwgaW5mby5kZXNjcmlwdGlvbiwgVXRpbC5idWlsZEhUTUwoJ2lucHV0Jywge1xyXG4gICAgICAgICAgICBpZDogc2V0dGluZyxcclxuICAgICAgICAgICAgYXR0cmlidXRlczoge1xyXG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnY2hlY2tib3gnLFxyXG4gICAgICAgICAgICAgICAgJ2RhdGEtdGFyZ2V0JzogJ2NoZWNrYm94J1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGluaXQoKTogdm9pZCB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NldHRpbmdzLW5vcm1hbCcpLmlubmVySFRNTCArPSBjcmVhdGVDaGVja2JveE9wdGlvbihTZXR0aW5ncy5EQVRBX1BST1RFQ1RJT04sIHtcclxuICAgICAgICAgICAgdGl0bGU6ICdEYXRhIFByb3RlY3Rpb24nLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0JsdXIgc29tZSBzZXR0aW5ncyBvbiB0aGUgYWNjb3VudCBwYWdlIHRvIHByb3RlY3QgeW91cnNlbGYnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGFkZCBldmVudHNcclxuICAgICAgICAoPE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXRhcmdldF0nKSkuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgc3dpdGNoIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnY2hlY2tib3gnOlxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQub25jbGljayA9ICgpID0+IGNvbnNvbGUuZGVidWcoJ2NsaWNrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgKDxOb2RlTGlzdE9mPEhUTUxFbGVtZW50Pj5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2V0dGluZy1kZXNjcmlwdGlvbi5hY3Rpb24nKSkuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgZWxlbWVudC5vbmNsaWNrID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29sbGFwc2VkVGV4dCA9IDxIVE1MRWxlbWVudD5lbGVtZW50LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLnNldHRpbmctZGVzY3JpcHRpb24udGV4dC1jb2xsYXBzZWQnKTtcclxuICAgICAgICAgICAgICAgIGxldCBzeW1Db2xsYXBzZWQgPSA8SFRNTEVsZW1lbnQ+ZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2V0dGluZy1kZXNjcmlwdGlvbi5zeW0tY29sbGFwc2VkJyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZXhwYW5kZWRUZXh0ID0gPEhUTUxFbGVtZW50PmVsZW1lbnQucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2V0dGluZy1kZXNjcmlwdGlvbi50ZXh0LWV4cGFuZGVkJyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3ltRXhwYW5kZWQgPSA8SFRNTEVsZW1lbnQ+ZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2V0dGluZy1kZXNjcmlwdGlvbi5zeW0tZXhwYW5kZWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY29sbGFwc2VkVGV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbGxhcHNlZFRleHQuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZXR0aW5nLWRlc2NyaXB0aW9uIHRleHQtZXhwYW5kZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICBzeW1Db2xsYXBzZWQuaW5uZXJUZXh0ID0gJy0nO1xyXG4gICAgICAgICAgICAgICAgICAgIHN5bUNvbGxhcHNlZC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NldHRpbmctZGVzY3JpcHRpb24gc3ltLWV4cGFuZGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGV4cGFuZGVkVGV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV4cGFuZGVkVGV4dC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NldHRpbmctZGVzY3JpcHRpb24gdGV4dC1jb2xsYXBzZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICBzeW1FeHBhbmRlZC5pbm5lclRleHQgPSAnKyc7XHJcbiAgICAgICAgICAgICAgICAgICAgc3ltRXhwYW5kZWQuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZXR0aW5nLWRlc2NyaXB0aW9uIHN5bS1jb2xsYXBzZWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCk7XHJcblxyXG59XHJcbiJdfQ==