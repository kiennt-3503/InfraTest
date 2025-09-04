import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { getLinkVerifyCode } from "@/apis/verifyCode";
import { LinkVerifyCodeResponse } from "@/types/verifyCode";

const useLinkVerifyCode = () => {
  const [link, setLink] = useState<string>("");

  const mutation = useMutation({
    mutationFn: getLinkVerifyCode,
    onSuccess: (data: LinkVerifyCodeResponse) => {
      setLink(data.link);
    },
  });
  useEffect(() => {
    mutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    link,
  };
};

export default useLinkVerifyCode;
