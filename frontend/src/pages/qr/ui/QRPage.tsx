import { writeClipboard } from "@solid-primitives/clipboard";
import { createAsync, useAction, useSubmission } from "@solidjs/router";
import QRCodeStyling, {
  CornerDotType,
  CornerSquareType,
  DotType,
  DrawType,
  ErrorCorrectionLevel,
  Mode,
  Options,
  TypeNumber,
} from "qr-code-styling";
import { createEffect, createMemo, createSignal, onCleanup, Show } from "solid-js";

import { getCurrentUser, updateUserSecretIdAction } from "@/entities/user";
import Button from "@/shared/ui/button";
import Replace from "@/shared/ui/replace";
import Skeleton from "@/shared/ui/skeleton";
import Tooltip from "@/shared/ui/tooltip";
import { Navigation } from "@/widgets/nav";

import IconIcRoundAddLink from "~icons/ic/round-add-link";
import IconIcRoundCheck from "~icons/ic/round-check";
import IconIcRoundContentCopy from "~icons/ic/round-content-copy";
import IconIcRoundFileDownload from "~icons/ic/round-file-download";
import IconIcRoundRefresh from "~icons/ic/round-refresh";

const QRPage = () => {
  const currentUser = createAsync(() => getCurrentUser());

  const updateUserSecretId = useAction(updateUserSecretIdAction);
  const updatingUserSecretId = useSubmission(updateUserSecretIdAction);

  const data = createMemo(
    () =>
      `${window.location.protocol}//${window.location.host}/start?user_id=${currentUser()?.id}&secret_id=${currentUser()?.secret_id}`,
  );

  const [showUrlCopied, setShowUrlCopied] = createSignal<boolean>(false);
  const [showImageCopied, setShowImageCopied] = createSignal<boolean>(false);

  const [options] = createSignal<Options>({
    width: 300,
    height: 300,
    type: "svg" as DrawType,
    data: data(),
    image: "/favicon.ico",
    margin: 8,
    qrOptions: {
      typeNumber: 0 as TypeNumber,
      mode: "Byte" as Mode,
      errorCorrectionLevel: "Q" as ErrorCorrectionLevel,
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.5,
      margin: 8,
      crossOrigin: "anonymous",
    },
    dotsOptions: {
      color: "#222222",
      type: "rounded" as DotType,
    },
    backgroundOptions: {
      color: "#FFFFFF",
      round: 0.2,
    },
    cornersSquareOptions: {
      color: "#222222",
      type: "extra-rounded" as CornerSquareType,
    },
    cornersDotOptions: {
      color: "#222222",
      type: "dot" as CornerDotType,
    },
  });
  const [qrRef, setQrRef] = createSignal<HTMLElement>();
  const [qr, setQr] = createSignal<QRCodeStyling>();

  const refreshQr = async () => {
    const user = currentUser();

    if (user) {
      await updateUserSecretId(user.id);
    }
  };

  const downloadQr = () => {
    qr()?.download({ name: `QR-код для пользователя ${currentUser()?.username}` });
  };

  const copyQrUrl = () => {
    writeClipboard(data());
    setShowUrlCopied(true);
  };

  const copyQrPng = async () => {
    const blob = await qr()?.getRawData("png");
    writeClipboard([
      new ClipboardItem({
        // @ts-expect-error non null
        "image/png": blob,
      }),
    ]);
    setShowImageCopied(true);
  };

  createEffect(() => {
    setQr(new QRCodeStyling(options()));
  });

  createEffect(() => {
    qr()?.append(qrRef());
  });

  createEffect(() => {
    qr()?.update({ ...options(), data: data() });
  });

  createEffect(() => {
    if (showUrlCopied()) {
      const timeout = setTimeout(() => {
        setShowUrlCopied(false);
      }, 2000);

      onCleanup(() => {
        clearTimeout(timeout);
      });
    }
  });

  createEffect(() => {
    if (showImageCopied()) {
      const timeout = setTimeout(() => {
        setShowImageCopied(false);
      }, 2000);

      onCleanup(() => {
        clearTimeout(timeout);
      });
    }
  });

  return (
    <section class="flex grow flex-col">
      <Navigation
        label="QR-код"
        after={
          <>
            <Button
              as={Tooltip}
              value="Обновить QR-код"
              shape="circle"
              spacing="sm"
              variant="ghost"
              placement="bottom"
              appearance="tertiary"
              onClick={refreshQr}
              loadig={updatingUserSecretId.pending}
            >
              <IconIcRoundRefresh class="size-full" />
            </Button>
            <Button
              as={Tooltip}
              value="Скачать QR-код"
              shape="circle"
              spacing="sm"
              variant="ghost"
              placement="bottom"
              appearance="tertiary"
              onClick={downloadQr}
            >
              <IconIcRoundFileDownload class="size-full" />
            </Button>
            <Button
              as={Tooltip}
              value={showImageCopied() ? "QR-код скопирован" : "Скопировать QR-код как PNG"}
              shape="circle"
              spacing="sm"
              variant="ghost"
              placement="bottom"
              appearance="tertiary"
              onClick={copyQrPng}
            >
              <Replace class="flex size-6 items-center justify-center">
                <Show when={showImageCopied()} fallback={<IconIcRoundContentCopy class="size-full" />}>
                  <IconIcRoundCheck class="size-full" />
                </Show>
              </Replace>
            </Button>
            <Button
              as={Tooltip}
              value={showUrlCopied() ? "Ссылка скопирована" : "Скопировать ссылку"}
              shape="circle"
              spacing="sm"
              variant="ghost"
              placement="bottom"
              appearance="tertiary"
              onClick={copyQrUrl}
            >
              <Replace class="flex size-6 items-center justify-center">
                <Show when={showUrlCopied()} fallback={<IconIcRoundAddLink class="size-full" />}>
                  <IconIcRoundCheck class="size-full" />
                </Show>
              </Replace>
            </Button>
          </>
        }
      />
      <Show
        when={qr()}
        fallback={<Skeleton class="flex size-75 grow items-center justify-center self-center rounded-4xl" />}
      >
        <div ref={setQrRef} class="flex grow items-center justify-center self-center" />
      </Show>
    </section>
  );
};

export default QRPage;
