module Add_Links_Skin {

    DEBUG && console.debug('[BuffUtility] Module.Add_Links_Skin');

    const enum Constants {
        BUFF_IMG_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAFVBMVEVHcEwhIS0hISshISshISv///+QkJU/x7PBAAAABHRSTlMAJK7xdunbSwAAAFxJREFUeAFjYFR2QQJGAgzCLijAkEEFVcCJwQRVwJnBBQ2QKxAKBXgEwIpTw1AF3EJTEAJQBQgBhAKEQCqaoW5YbHGhuYAbqufCXFJRBVIoC1OMiMKISozIxkgOAEjZind3Npg5AAAAAElFTkSuQmCC',
        BUFF_TAB_ID = 'buffprices'
    }

    async function init(): Promise<void> {
        let itemHeader = document.querySelector('h2');
        let itemName = itemHeader.innerText.trim();

        let isUnusual = itemName.indexOf('Knife') > -1 || itemName.indexOf('Gloves') > -1;

        let hasStatTrack = !!itemHeader.parentElement.querySelector('div.stattrak');
        let hasSouvenir = !!itemHeader.parentElement.querySelector('div.souvenir');
        let hasSpecialQuality = hasStatTrack || hasSouvenir;

        console.debug(`[BuffUtility] Added Buff links to csgostash for: ${itemName}`, `\n hasStatTrack: ${hasStatTrack}`, `\n hasSouvenir: ${hasSouvenir}`);

        let tabs = <HTMLElement>document.querySelector('div.price-details-nav > ul.nav.nav-tabs');

        tabs.innerHTML += Util.buildHTML('li', {
            class: 'misc-click',
            attributes: {
                'role': 'presentation'
            },
            content: [Util.buildHTML('a', {
                attributes: {
                    'href': `#${Constants.BUFF_TAB_ID}`,
                    'role': 'tab',
                    'data-toggle': 'tab',
                    'aria-controls': Constants.BUFF_TAB_ID,
                    'aria-expanded': 'true'
                },
                content: [
                    Util.buildHTML('img', {
                        class: 'price-tab-icon',
                        attributes: {
                            'src': Constants.BUFF_IMG_BASE64,
                            'alt': 'Buff Logo'
                        }
                    }),
                    Util.buildHTML('span', {
                        class: 'hidden-xs hidden-md',
                        content: [ 'Buff' ]
                    })
                ]
            })]
        });

        let priceDetails = <HTMLElement>document.querySelector('div.price-details > div.tab-content');

        async function buildQuery(wear: string, specialQuality: boolean = false): Promise<string> {
            // search all
            if (wear?.length == 0) {
                return `https://buff.163.com/market/csgo#tab=selling&page_num=1&search=${encodeURIComponent(itemName)}`;
            }

            let quality = isUnusual ? 'unusual' : 'normal';
            if (specialQuality && hasSpecialQuality) {
                if (isUnusual) {
                    quality = 'unusual_strange';
                } else {
                    quality = hasStatTrack ? 'strange' : 'tournament';
                }
            }

            const hash_name = `${isUnusual ? '★ ' : (specialQuality && hasSpecialQuality ? (hasStatTrack ? 'StatTrak™ ' : 'Souvenir ') : '')}${itemName} (${wear})`;
            const goods_id: number = (await BrowserInterface.delegate<BrowserInterface.BuffSchemaGetIdOrNameDelegation, number>({
                method: BrowserInterface.DelegationMethod.BuffSchema_get,
                parameters: {
                    name: hash_name
                }
            })).data;

            DEBUG && console.debug(hash_name, goods_id);

            if (typeof goods_id == 'number') {
                return `https://buff.163.com/goods/${goods_id}?from=market#tab=selling&sort_by=default`;
            }

            return `https://buff.163.com/market/csgo#tab=selling&page_num=1&search=${encodeURIComponent(`${itemName}${wear ? ` (${wear})` : ''}`)}${wear ? `&quality=${quality}` : ''}`;
        }

        type HTMLBuilderSection = {
            type: {
                isSpecial: boolean,
                wear: string
            },
            html: string
        };

        const promiseSpecialQualityCollection: Promise<HTMLBuilderSection>[] = hasSpecialQuality ? ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'].map(async wear => {
            return {
                type: {
                    isSpecial: true,
                    wear: wear
                },
                html: Util.buildHTML('div', {
                    class: 'btn-group-sm btn-group-justified',
                    content: [Util.buildHTML('a', {
                        class: 'btn btn-default btn-sm',
                        attributes: {
                            'href': (await buildQuery(wear, hasSpecialQuality)),
                            'target': '_blank',
                            'rel': 'nofollow',
                            'data-gaevent': itemName
                        },
                        content: [
                            Util.buildHTML('span', {
                                class: `pull-left ${hasStatTrack ? 'price-details-st' : 'price-details-souv'}`,
                                content: [hasStatTrack ? 'StatTrack' : 'Souvenir']
                            }),
                            Util.buildHTML('span', {
                                class: 'pull-left',
                                content: [wear]
                            })
                        ]
                    })]
                })
            };
        }) : [];

        const promiseNormalCollection: Promise<HTMLBuilderSection>[] = ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'].map(async wear => {
            return {
                type: {
                    isSpecial: false,
                    wear: wear
                },
                html: Util.buildHTML('div', {
                    class: 'btn-group-sm btn-group-justified',
                    content: [Util.buildHTML('a', {
                        class: 'btn btn-default btn-sm',
                        attributes: {
                            'href': (await buildQuery(wear)),
                            'target': '_blank',
                            'rel': 'nofollow',
                            'data-gaevent': itemName
                        },
                        content: [
                            Util.buildHTML('span', {
                                class: 'pull-left',
                                content: [wear]
                            })
                        ]
                    })]
                })
            };
        });

        Promise.all([...promiseSpecialQualityCollection, ...promiseNormalCollection]).then(async values => {
            const specialTabs = values.filter(x => x.type.isSpecial).map(x => x.html).join('');
            const normalTabs = values.filter(x => !x.type.isSpecial).map(x => x.html).join('');

            const pricesTab = Util.buildHTML('div', {
                id: Constants.BUFF_TAB_ID,
                class: 'tab-pane',
                attributes: {
                    'role': 'tabpanel'
                },
                content: [
                    Util.buildHTML('div', {
                        class: 'btn-group-sm btn-group-justified price-bottom-space',
                        content: [Util.buildHTML('a', {
                            class: 'btn btn-default btn-sm',
                            attributes: {
                                'href': (await buildQuery('')),
                                'target': '_blank',
                                'rel': 'nofollow',
                                'data-gaevent': itemName
                            },
                            content: [ 'Search Buff (All)' ]
                        })]
                    }),
                    hasSpecialQuality ? `${specialTabs}<div class="price-bottom-space"></div>` : '',
                    normalTabs
                ]
            });

            priceDetails.innerHTML += pricesTab;
        });

        // let pricesTab = Util.buildHTML('div', {
        //     id: Constants.BUFF_TAB_ID,
        //     class: 'tab-pane',
        //     attributes: {
        //         'role': 'tabpanel'
        //     },
        //     content: [
        //         Util.buildHTML('div', {
        //             class: 'btn-group-sm btn-group-justified price-bottom-space',
        //             content: [Util.buildHTML('a', {
        //                 class: 'btn btn-default btn-sm',
        //                 attributes: {
        //                     'href': (await buildQuery('')),
        //                     'target': '_blank',
        //                     'rel': 'nofollow',
        //                     'data-gaevent': itemName
        //                 },
        //                 content: [ 'Search Buff (All)' ]
        //             })]
        //         }),
        //         hasSpecialQuality ? `${['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'].map(async wear => {
        //             return Util.buildHTML('div', {
        //                 class: 'btn-group-sm btn-group-justified',
        //                 content: [Util.buildHTML('a', {
        //                     class: 'btn btn-default btn-sm',
        //                     attributes: {
        //                         'href': (await buildQuery(wear, hasSpecialQuality)),
        //                         'target': '_blank',
        //                         'rel': 'nofollow',
        //                         'data-gaevent': itemName
        //                     },
        //                     content: [
        //                         Util.buildHTML('span', {
        //                             class: `pull-left ${hasStatTrack ? 'price-details-st' : 'price-details-souv'}`,
        //                             content: [hasStatTrack ? 'StatTrack' : 'Souvenir']
        //                         }),
        //                         Util.buildHTML('span', {
        //                             class: 'pull-left',
        //                             content: [wear]
        //                         })
        //                     ]
        //                 })]
        //             });
        //         }).join('')}<div class="price-bottom-space"></div>` : '',
        //         ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'].map(async wear => {
        //             /*
        //             <div class="btn-group-sm btn-group-justified">
        //                 <a href="" target="_blank" rel="nofollow" class="btn btn-default btn-sm" data-gaevent="">
        //                     <span class="pull-left">Factory New</span>
        //                 </a>
        //             </div>
        //              */
        //             return Util.buildHTML('div', {
        //                 class: 'btn-group-sm btn-group-justified',
        //                 content: [Util.buildHTML('a', {
        //                     class: 'btn btn-default btn-sm',
        //                     attributes: {
        //                         'href': (await buildQuery(wear)),
        //                         'target': '_blank',
        //                         'rel': 'nofollow',
        //                         'data-gaevent': itemName
        //                     },
        //                     content: [
        //                         Util.buildHTML('span', {
        //                             class: 'pull-left',
        //                             content: [ wear ]
        //                         })
        //                     ]
        //                 })]
        //             });
        //         }).join('')
        //     ]
        // });
        //
        // priceDetails.innerHTML += pricesTab;
    }

    init();

}
