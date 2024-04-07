import { createElement, useEffect, useState, useCallback, useRef } from "react";
import { Dimensions, View, Text, TouchableWithoutFeedback, StyleSheet } from "react-native";
import Carousel from "react-native-snap-carousel";
import { useSwipe } from "./components/useSwipe";
const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

// hex color regex validation, support for 3-character HEX codes (no transparent supported)
// This means that instead of matching exactly 6 characters, it will match exactly 3 characters, but only 1 or 2 times. Allowing "ABC" and "AABBCC", but not "ABCD"
const hexColorValidate = /^#([0-9A-F]{3}){1,2}$/i;

export function SnapCarousel({
    dataType,
    staticItems,
    data,
    action,
    content,
    scrollEnabled,
    firstItem,
    layout,
    pagination,
    paginationColor,
    loop,
    autoplay,
    autoplayDelay,
    autoplayInterval,
    lockScrollWhileSnapping,
    activeSlideOffset,
    layoutCardOffset,
    inactiveSlideOpacity,
    inactiveSlideScale,
    carouselWidth,
    customWidth,
    carouselPadding
}) {
    const [itemsObj, setItemsObj] = useState({});
    const [itemsKey, setItemsKey] = useState([]);

    const [activeItem, setActiveItem] = useState(0);
    const [startingItemIndex, setStartingItemIndex] = useState(null);

    const [scroll, setScroll] = useState(true);
    const [loopTimeout, setLoopTimeout] = useState(null);
    const [longPressFlag, setLongPressFlag] = useState(false);

    const [calcCarouselWidth, setCalcCarouselWidth] = useState(0);
    const [calcCarouselHeight, setCalcCarouselHeight] = useState(0);
    const [itemHeight, setItemHeight] = useState(0);

    const _carousel = useRef();

    /*****************************************************************************/
    /**************************** Manual Infante Loop ****************************/
    /*****************************************************************************/
    const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 4);
    /**
     * This method is handling navigating to the first item when swiping left the last item or navigating to the second item when swiping left the first item
     */
    function onSwipeLeft() {
        const idxToSwipe = activeItem === itemsKey.length - 1 ? 0 : activeItem + 1;
        _carousel?.current?.snapToItem(idxToSwipe);
    }

    /**
     * This method is handling navigating to the last item when swiping right the first item or navigating to the before last item when swiping left the last item
     */
    function onSwipeRight() {
        const idxToSwipe = activeItem === 0 ? itemsKey.length - 1 : activeItem - 1;
        _carousel?.current?.snapToItem(idxToSwipe);
    }
    /*****************************************************************************/
    /*****************************************************************************/
    /*****************************************************************************/

    /**
     * this method will calculate the height of the carousel depending on the item height
     */
    const setCarouselHeight = useCallback(event => {
        if (calcCarouselHeight < event?.nativeEvent?.layout?.height) {
            const height = event?.nativeEvent?.layout?.height;
            setItemHeight(height);
            let offset = layoutCardOffset;
            setCalcCarouselHeight(height + offset);
        }
    });

    /**
     * Mandatory method by 'react-native-snap-carousel' to return items component
     *
     * @param {*} item - data array item
     * @param {number} index - item index in the carousel
     * @returns {React native component}
     */
    const _renderItem = ({ item, index }) => <View onLayout={setCarouselHeight}>{itemsObj[index]?.content}</View>;

    /**
     * Validate the numerics values before setting them in the carousel properties
     *
     * @param {number} value - the actual value
     * @param {number} min - the maximum allowed value
     * @param {number} max - the minimum allowed value
     * @returns
     */
    const validateValue = (value, min, max) => (value < min ? min : value > max ? max : value);

    /**
     * Validate the hex color of the pagination text or set the default color
     *
     * @param {string} value
     * @returns {string}
     */
    const validateColor = value => (hexColorValidate.test(value) ? value : "#3b4045");

    /**
     * Clear the autoplay timer as it's manually created and destroyed
     */
    const clearAutoLoopTimer = () => {
        if (loopTimeout) {
            clearTimeout(loopTimeout);
            setLoopTimeout(null);
        }
    };

    /**
     * this function is used to fire the current item action and set the new active item to change the pagination
     *
     * @param {number} slideIndex
     */
    const onBeforeSnapToItem = slideIndex => {
        setLongPressFlag(false);
        setActiveItem(slideIndex);
        let actionToFire = itemsObj[slideIndex]?.action;
        if (actionToFire?.canExecute) {
            actionToFire.execute();
        }

        // Part of manual infinite loop, navigating to the first item to start the loop again when reaching to the last item
        // and cancel the current action when swiping manually to any other item
        if (autoplay && loop && slideIndex === itemsKey.length - 1) {
            setLoopTimeout(
                setTimeout(() => {
                    _carousel?.current?.snapToItem(0);
                }, autoplayInterval)
            );
        } else if (autoplay && loop) {
            clearAutoLoopTimer();
        }
    };

    /**
     * setting the data array that required in "react-native-snap-carousel" and the object mapping to like every item with it's own action
     * using the index as a key
     */
    useEffect(() => {
        if (dataType === "static") {
            let itemsList = staticItems.reduce((acc, item, index) => {
                acc[index] = {
                    content: item.staticContent,
                    action: item.staticAction
                };
                return acc;
            }, {});

            setItemsObj(itemsList);
            setItemsKey(Object.keys(itemsList));
        } else if (data.status === "available") {
            let itemsList = data.items.reduce((acc, item, index) => {
                acc[index] = {
                    item,
                    content: content.get(item),
                    action: action?.get(item)
                };
                return acc;
            }, {});

            setItemsObj(itemsList);
            setItemsKey(Object.keys(itemsList));
        }
    }, [data]);

    /**
     * setting the current item start the carousel from and to render it in the pagination
     */
    useEffect(() => {
        if (itemsKey.length) {
            let toSetActiveItem =
                firstItem?.status === "available"
                    ? firstItem.value
                        ? validateValue(Number(firstItem.value), 0, itemsKey.length - 1)
                        : 0
                    : 0;
            setStartingItemIndex(toSetActiveItem);
            onBeforeSnapToItem(toSetActiveItem);
        }
    }, [itemsKey.length]);

    useEffect(() => {
        if (scrollEnabled?.status === "available") {
            setScroll(scrollEnabled.value !== null && scrollEnabled.value !== undefined ? scrollEnabled.value : true);
        }
    }, [scrollEnabled]);

    /**
     * calculate the carousel width
     */
    useEffect(() => {
        let widthToSet = carouselWidth === "full" ? windowWidth : validateValue(customWidth, 1, windowWidth);
        setCalcCarouselWidth(widthToSet);
    }, []);

    return itemsKey?.length && calcCarouselWidth && startingItemIndex !== null ? (
        <View>
            {/* creating an overlay to detect swiping left/right to create a manual infinite loop, as the loop from the library itself didn't work, also adding the touch events to the view from  "_renderItem" also didn't work */}
            {loop && scroll && (activeItem === 0 || activeItem === itemsKey.length - 1) && (
                <TouchableWithoutFeedback
                    onLongPress={
                        autoplay
                            ? () => {
                                  setLongPressFlag(true);
                                  _carousel?.current?.stopAutoplay();
                                  clearAutoLoopTimer();
                              }
                            : undefined
                    }
                    onPressOut={
                        longPressFlag
                            ? () => {
                                  setLongPressFlag(false);
                                  _carousel?.current?.startAutoplay();
                                  setLoopTimeout(
                                      setTimeout(() => {
                                          onSwipeLeft();
                                      }, autoplayInterval)
                                  );
                              }
                            : onTouchEnd
                    }
                    onPressIn={onTouchStart}
                >
                    <View
                        style={{
                            ...styles.overlay,
                            height: itemHeight,
                            // same as item width
                            width: calcCarouselWidth - validateValue(carouselPadding, 0, calcCarouselWidth - 1),
                            left: carouselPadding / 2
                        }}
                    ></View>
                </TouchableWithoutFeedback>
            )}
            <View style={{ ...styles.mainContainer, width: calcCarouselWidth }}>
                <Carousel
                    ref={_carousel}
                    /********************* Data and Action ********************/
                    data={itemsKey}
                    renderItem={_renderItem}
                    firstItem={startingItemIndex}
                    scrollEnabled={scroll}
                    onBeforeSnapToItem={slideIndex => onBeforeSnapToItem(slideIndex)}
                    /************************* Behavior ***********************/
                    layout={layout}
                    autoplay={autoplay}
                    autoplayDelay={validateValue(autoplayDelay, 1000, 300000)}
                    autoplayInterval={validateValue(autoplayInterval, 1000, 300000)}
                    lockScrollWhileSnapping={autoplay ? false : lockScrollWhileSnapping}
                    activeSlideOffset={validateValue(activeSlideOffset, 1, windowWidth / 2)}
                    /****************** Style and animation *******************/
                    layoutCardOffset={validateValue(layoutCardOffset, 0, windowHeight)}
                    inactiveSlideOpacity={validateValue(Number(inactiveSlideOpacity), 0, 1)}
                    inactiveSlideScale={validateValue(Number(inactiveSlideScale), 0, 1)}
                    sliderWidth={calcCarouselWidth}
                    itemWidth={calcCarouselWidth - validateValue(carouselPadding, 0, calcCarouselWidth - 1)}
                    containerCustomStyle={{
                        height: calcCarouselHeight && layout === "tinder" ? calcCarouselHeight : "auto"
                    }}
                />
                {pagination && (
                    <Text style={{ ...styles.pagination, color: validateColor(paginationColor) }}>{`${activeItem + 1}/${
                        itemsKey.length
                    }`}</Text>
                )}
            </View>
        </View>
    ) : (
        <View></View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        alignItems: "center"
    },
    pagination: {
        marginTop: 5
    },
    overlay: {
        position: "absolute",
        zIndex: 1
    }
});
