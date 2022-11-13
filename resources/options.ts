module Options {

    // imports
    import Settings = ExtensionSettings.Settings;

    // module

    interface DisplayInfo {
        title: string,
        description: string
    }

    function createSettingHTML(title: string, description: string, settingHTML: string): string {
        return Util.buildHTML('tr', {
            content: [
                Util.buildHTML('td', {
                    content: [
                        Util.buildHTML('div', {
                            class: 'setting-title',
                            content: [ title ]
                        }),
                        Util.buildHTML('div', {
                            class: 'setting-description action',
                            content: [ `<span class="setting-description sym-collapsed">+</span> Description</div>` ]
                        }),
                        Util.buildHTML('div', {
                            class: 'setting-description text-collapsed',
                            content: [ description ]
                        })
                    ]
                }),
                Util.buildHTML('td', {
                    content: [ settingHTML ]
                }),
                Util.buildHTML('td')
            ]
        });
    }

    function createCheckboxOption(setting: Settings, info: DisplayInfo): string {
        return createSettingHTML(info.title, info.description, Util.buildHTML('input', {
            id: setting,
            attributes: {
                'type': 'checkbox',
                'data-target': 'checkbox'
            }
        }));
    }

    function init(): void {
        document.getElementById('settings-normal').innerHTML += createCheckboxOption(Settings.DATA_PROTECTION, {
            title: 'Data Protection',
            description: 'Blur some settings on the account page to protect yourself'
        });

        // add events
        (<NodeListOf<HTMLElement>>document.querySelectorAll('[data-target]')).forEach(element => {
            switch (element.getAttribute('data-target')) {
                case 'checkbox':
                    element.onclick = () => console.debug('click');
                    break;
            }
        });

        (<NodeListOf<HTMLElement>>document.querySelectorAll('.setting-description.action')).forEach(element => {
            element.onclick = (event) => {
                let collapsedText = <HTMLElement>element.parentElement.querySelector('.setting-description.text-collapsed');
                let symCollapsed = <HTMLElement>element.querySelector('.setting-description.sym-collapsed');
                let expandedText = <HTMLElement>element.parentElement.querySelector('.setting-description.text-expanded');
                let symExpanded = <HTMLElement>element.querySelector('.setting-description.sym-expanded');

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

}
